export interface INote {
  ownerName: string;
  posX: number;
  posY: number;
  id: number;
  color: string;
  noteText?: string;
};

export interface ISuperDatabase {
  add_user(name: string): void;
  get_all_notes(): INote[];
  update_note(note: INote): void;
  update_all_notes(note: INote): void;
};

type User = string;

export class super_database implements ISuperDatabase {
  private notes: Map<INote['id'], INote> = new Map();
  private users = new Set<User>();

  add_user(name: string) {
    this.users.add(name);
  }

  get_all_notes() {
    return [...this.notes.values()];
  }

  update_note(note: INote) {
    this.notes.set(note.id, note);
  }

  update_all_notes(note: INote) {
    this.notes.set(note.id, note);
  }
}
