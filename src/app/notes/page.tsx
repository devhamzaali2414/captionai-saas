import { getNotes, deleteNote } from '@/app/actions/notes';
import AddNoteForm from '@/components/AddNoteForm';
import styles from './Notes.module.css';

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>💡 Clinic Knowledge Bank</h1>
        <p className={styles.subtitle}>
          Dump your thoughts, news, promos, or patient FAQs here via typing or <strong>🎙️ Voice Dictation</strong>.
        </p>
      </header>

      <AddNoteForm />

      <div className={styles.notesList}>
        {notes.length === 0 ? (
          <div className={styles.emptyState}>
            No notes yet. Add your first note above to train the AI to sound like your practice!
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className={styles.noteCard}>
              <div className={styles.noteContent}>{note.content}</div>
              <div className={styles.noteMeta}>
                <span>{new Date(note.createdAt).toLocaleString()}</span>
                <form
                  action={async () => {
                    'use server';
                    await deleteNote(note.id);
                  }}
                >
                  <button type="submit" className={styles.deleteBtn}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
