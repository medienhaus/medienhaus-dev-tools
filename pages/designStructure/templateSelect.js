import React, { useEffect, useState } from 'react';

import Select from '../../components/UI/Select';

/**
 * `TemplateSelect` is a functional component that renders a select dropdown with template options.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.templates - The templates to display in the dropdown. Each template is an object with properties that define the template.
 * @param {Function} props.setTemplates - The function to call when the templates need to be updated. This function is passed the updated templates.
 * @param {Function} props.setSelectedTemplate - The function to call when a template is selected. This function is passed the selected template.
 * @param {Object} props.selectedTemplate - The currently selected template. If this prop is provided, the dropdown will be a controlled component.
 *
 * @returns {JSX.Element} A select dropdown element.
 */
const TemplateSelect = ({ templates, setTemplates, setSelectedTemplate, selectedTemplate }) => {
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

    useEffect(() => {
        if (selectedTemplate) {
            setNewTemplateName(selectedTemplate);
        }
    }, [selectedTemplate]);

    return (
        <>
            <Select selectedValue={selectedTemplate} setSelectedValue={handleSelect} placeholderText="template*" options={[...templates, { name: 'create', display: 'createNew…' }]} />
            { createSelected &&
            <>
                <input required type="text" placeholder={newTemplatePlaceholder} onChange={handleInputChange} value={newTemplateName} />
                <button onClick={handleClick} disabled={!newTemplateName}>create new template</button>
            </>
            }
        </>
    );
};

export default TemplateSelect;
