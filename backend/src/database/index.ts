export interface INote {
  ownerName: string;
  posX: number;
  posY: number;
  id: number;
  color: string;
  noteText?: string;
};

export interface ISuperStorage {
  add_user(name: string): void;
  get_all_notes(): INote[];
  update_note(note: INote): void;
  update_all_notes(note: INote): void;
};

export class super_database implements ISuperStorage {
  notes: Map<number, INote> = new Map();
  users = new Set<string>();

  add_user(name: string): void {
    this.users.add(name);
  }

  get_all_notes(): INote[] {
    return [...this.notes.values()];
  }

  update_note(note: INote) {
    console.log({ note });
    this.notes.set(note.id, note);
  }

  update_all_notes(note: INote) {
    this.notes.set(note.id, note);
  }
}
