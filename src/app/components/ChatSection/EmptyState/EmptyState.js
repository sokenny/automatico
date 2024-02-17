import styles from './EmptyState.module.css';

const EmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateText}>
        This is a gpt based LLM with the additional context of our +120 database
        tables with their respective columns and data types.
        <br />
        <br />
        It leverages the RAG method to incorporate the vast additional context
        into its responses.
        <br />
        <br />
        Answers consist mainly of SQL queries.
        <br />
        <br />
        If the LLM fails at providing the answer you needed, try including the
        relevant table names in your query.
      </div>
    </div>
  );
};

export default EmptyState;
