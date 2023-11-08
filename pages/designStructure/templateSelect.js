import React, { useState } from 'react';

import Select from '../../components/UI/Select';

/**
 * `TemplateSelect` is a React component for selecting a template from a list or creating a new one.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.templates - An array of template objects, each with a `name` and `display` property.
 * @param {Function} props.setTemplates - A function to update the `templates` state.
 * @param {Function} props.setSelectedTemplate - A function to update the selected template.
 *
 * @example
 * <TemplateSelect templates={templates} setTemplates={setTemplates} setSelectedTemplate={setSelectedTemplate} />
 *
 * @returns {React.Element} The rendered React element.
 */
export default function TemplateSelect({ templates, setTemplates, setSelectedTemplate }) {
    const [createSelected, setCreateSelected] = useState(false);
    const [newTemplatePlaceholder, setNewTemplatePlaceholder] = useState('new template…');
    const [newTemplateName, setNewTemplateName] = useState('');

    const handleSelect = (value) => {
        if (value === 'create') {
            setCreateSelected(true);
        } else {
            setCreateSelected(false);
            setSelectedTemplate(value);
        }
    };

    const handleInputChange = (event) => {
        setNewTemplateName(event.target.value);
    };

    const handleClick = () => {
        // Check if the templates array already contains an object with the same name property
        if (!templates.some(template => template.name === newTemplateName)) {
            // Add the new template to the templates array
            setTemplates(prevTemplates => [...prevTemplates, { name: newTemplateName, display: newTemplateName }]);
            setNewTemplatePlaceholder('new template…');
        } else {
            setNewTemplatePlaceholder('already existing try another template name…');
        }
        // Clear the input field
        setNewTemplateName('');
    };

    return (
        <>
            <Select setSelectedValue={handleSelect} placeholderText="template*" options={[...templates, { name: 'create', display: 'createNew…' }]} />
            { createSelected &&
            <>
                <input required type="text" placeholder={newTemplatePlaceholder} onChange={handleInputChange} value={newTemplateName} />
                <button onClick={handleClick} disabled={!newTemplateName}>create new template</button>
            </>
            }
        </>
    );
}
