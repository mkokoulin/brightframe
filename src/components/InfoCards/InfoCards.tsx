import styles from "./InfoCards.module.css";

export type InfoCardItem = {
  id: string;
  title: string;
  description: string;

  href?: string;

  /** Mobile: shows linkText (e.g. "Learn more →") */
  linkText?: string;

  /** Desktop: caption under the left-hand icon (usually repeats title) */
  iconLabel?: string;

  icon: "building" | "wallet" | "map" | "package" | "hearts";
};

const Icon = ({ name }: { name: InfoCardItem["icon"] }) => {
  switch (name) {
    case "building":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 20V6a2 2 0 0 1 2-2h6v16" />
          <path d="M12 20V10h6a2 2 0 0 1 2 2v8" />
          <path d="M4 20h18" />
          <path d="M7 7h2M7 10h2M7 13h2M15 13h2M15 16h2" />
        </svg>
      );
    case "wallet":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 8h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
          <path d="M4 8V7a2 2 0 0 1 2-2h12" />
          <path d="M16 13h4" />
          <circle cx="16" cy="13" r="1" />
        </svg>
      );
    case "map":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18 3 20V6l6-2 6 2 6-2v14l-6 2-6-2Z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    case "package":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 8 12 3 3 8v10l9 5 9-5Z" />
          <path d="M3 8l9 5 9-5" />
          <path d="M12 13v10" />
          <path d="M9.5 11.5l2 2 4-4" />
        </svg>
      );
    case "hearts":
      return (
        <svg className={styles.iconSvg} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-7-4.4-9.2-8.7C1.3 9.2 3.2 6 6.7 6c1.6 0 3 .8 3.8 2 0 0 1.4-2 3.8-2 3.5 0 5.4 3.2 3.9 6.3C19 16.6 12 21 12 21Z" />
          <path d="M16.5 8.5c1.2 0 2 .9 1.7 2.2" />
        </svg>
      );
    default:
      return null;
  }
};

export type InfoCardsProps = {
  items: InfoCardItem[];
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "className">;

export function InfoCards({ items, className, ...rest }: InfoCardsProps) {
  return (
    <section className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <div className={styles.container}>
        <div className={styles.list}>
          {items.map((item) => {
            const iconLabel = item.iconLabel ?? item.title;

            const inner = (
              <>
                <div className={styles.left}>
                  <div className={styles.iconWrap}>
                    <Icon name={item.icon} />
                  </div>
                  <div className={styles.iconLabel}>{iconLabel}</div>
                </div>

                <div className={styles.content}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.desc}>{item.description}</p>

                  {item.linkText ? (
                    <span className={styles.mobileLink}>{item.linkText}</span>
                  ) : null}
                </div>

                {item.href ? (
                  <span className={styles.arrowBtn} aria-hidden="true">
                    <span className={styles.arrowIcon} />
                  </span>
                ) : null}
              </>
            );

            return item.href ? (
              <a key={item.id} className={styles.card} href={item.href}>
                {inner}
              </a>
            ) : (
              <div key={item.id} className={styles.card}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
