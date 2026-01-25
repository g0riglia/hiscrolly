import styles from "./EditableField.module.css";

function EditableField({ 
    value, 
    onChange, 
    type = "text", 
    editMode, 
    multiline = false,
    rows = 3,
    as: Tag = "p", 
    className, 
    ...delegated 
}) {
    if (editMode) {
        if (multiline) {
            return (
                <textarea
                    value={value}
                    onChange={event => onChange(event.target.value)}
                    className={`${styles.input} ${styles.textarea} ${className || ""}`}
                    rows={rows}
                    {...delegated}
                />
            );
        }
        
        return (
            <input
                value={value}
                type={type}
                onChange={event => onChange(event.target.value)}
                className={`${styles.input} ${className || ""}`}
                {...delegated}
            />
        );
    }

    return <Tag className={className} {...delegated}>{value}</Tag>;
}

export default EditableField;