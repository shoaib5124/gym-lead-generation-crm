// src/lib/api/notes.ts

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function deleteNoteApi(leadId: string, noteId: string) {
  const response = await fetch(
    `/api/freeTrial/${leadId}/notes/${noteId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  // Safe JSON parsing (server might return empty body)
  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || "Failed to delete note",
      response.status
    );
  }

  return data;
}