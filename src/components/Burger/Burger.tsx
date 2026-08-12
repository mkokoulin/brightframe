import styles from "./Burger.module.css";

export type BurgerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
};

export function Burger({ open, setOpen, className }: BurgerProps) {
  const lineCls = [styles.line, open ? styles.lineOpen : ""].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={[styles.burger, className].filter(Boolean).join(" ")}
      aria-pressed={open}
      aria-label="Menu"
      onClick={() => setOpen(!open)}
    >
      <span className={lineCls} />
      <span className={lineCls} />
      <span className={lineCls} />
    </button>
  );
}
