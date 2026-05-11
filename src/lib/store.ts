import { create } from "zustand";
import { supabase, isSupabaseConfigured } from "./supabase";
import type { Priority, Project, ProjectStatus, Task } from "./mock-data";

// ---------- DB row shapes ----------
type DBProject = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  due_date: string | null;
  created_at: string;
};

type DBTask = {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  tags: string[] | null;
  due_date: string | null;
  created_at: string;
};

// ---------- Row → app model mappers ----------
function mapProject(p: DBProject): Project {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    status: p.status,
    priority: p.priority,
    dueDate: p.due_date ?? new Date().toISOString().slice(0, 10),
    progress: 0,
    members: ["1"],
  };
}

function mapTask(t: DBTask): Task {
  return {
    id: t.id,
    projectId: t.project_id,
    title: t.title,
    completed: t.completed,
    priority: t.priority,
    tags: t.tags ?? [],
    dueDate: t.due_date ?? new Date().toISOString().slice(0, 10),
  };
}

// ---------- Store ----------
type DataState = {
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  loadAll: (userId: string) => Promise<void>;
  reset: () => void;
  addProject: (p: Omit<Project, "id" | "progress" | "members">) => Promise<void>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (t: Omit<Task, "id" | "completed">) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

export const useData = create<DataState>((set, get) => ({
  projects: [],
  tasks: [],
  loading: false,
  error: null,

  reset: () => set({ projects: [], tasks: [], error: null }),

  loadAll: async (userId) => {
    if (!isSupabaseConfigured) return;
    set({ loading: true, error: null });
    try {
      const [{ data: projects, error: pErr }, { data: tasks, error: tErr }] =
        await Promise.all([
          supabase
            .from("projects")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
          supabase
            .from("tasks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false }),
        ]);
      if (pErr) throw pErr;
      if (tErr) throw tErr;
      set({
        projects: (projects as DBProject[] | null)?.map(mapProject) ?? [],
        tasks: (tasks as DBTask[] | null)?.map(mapTask) ?? [],
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load data";
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },

  addProject: async (p) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw new Error("Not signed in");
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: u.user.id,
        name: p.name,
        description: p.description,
        status: p.status,
        priority: p.priority,
        due_date: p.dueDate,
      })
      .select("*")
      .single();
    if (error) throw error;
    set({ projects: [mapProject(data as DBProject), ...get().projects] });
  },

  updateProject: async (id, patch) => {
    const dbPatch: Record<string, unknown> = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.description !== undefined) dbPatch.description = patch.description;
    if (patch.status !== undefined) dbPatch.status = patch.status;
    if (patch.priority !== undefined) dbPatch.priority = patch.priority;
    if (patch.dueDate !== undefined) dbPatch.due_date = patch.dueDate;
    const { error } = await supabase.from("projects").update(dbPatch).eq("id", id);
    if (error) throw error;
    set({ projects: get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  },

  deleteProject: async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
    set({
      projects: get().projects.filter((p) => p.id !== id),
      tasks: get().tasks.filter((t) => t.projectId !== id),
    });
  },

  addTask: async (t) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw new Error("Not signed in");
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: u.user.id,
        project_id: t.projectId,
        title: t.title,
        priority: t.priority,
        tags: t.tags,
        due_date: t.dueDate,
        completed: false,
      })
      .select("*")
      .single();
    if (error) throw error;
    set({ tasks: [mapTask(data as DBTask), ...get().tasks] });
  },

  toggleTask: async (id) => {
    const current = get().tasks.find((t) => t.id === id);
    if (!current) return;
    const next = !current.completed;
    // Optimistic update
    set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, completed: next } : t)) });
    const { error } = await supabase.from("tasks").update({ completed: next }).eq("id", id);
    if (error) {
      // Revert on failure
      set({
        tasks: get().tasks.map((t) =>
          t.id === id ? { ...t, completed: current.completed } : t,
        ),
      });
      throw error;
    }
  },

  updateTask: async (id, patch) => {
    const dbPatch: Record<string, unknown> = {};
    if (patch.title !== undefined) dbPatch.title = patch.title;
    if (patch.priority !== undefined) dbPatch.priority = patch.priority;
    if (patch.tags !== undefined) dbPatch.tags = patch.tags;
    if (patch.dueDate !== undefined) dbPatch.due_date = patch.dueDate;
    if (patch.completed !== undefined) dbPatch.completed = patch.completed;
    if (patch.projectId !== undefined) dbPatch.project_id = patch.projectId;
    const { error } = await supabase.from("tasks").update(dbPatch).eq("id", id);
    if (error) throw error;
    set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  },

  deleteTask: async (id) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
  },
}));
