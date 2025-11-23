import api from "@/lib/api";

// DELETE
export async function deleteSubtaskApi(
  id: string,
  isPersonal: boolean = false
): Promise<void> {
  try {
    await api.delete(`subtask/${id}`);
  } catch (error: any) {
    console.error("deleteSubtaskApi error:", error);
    throw error;
  }
}