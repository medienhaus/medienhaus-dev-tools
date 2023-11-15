
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Parser } from '@json2csv/plainjs';
import _ from 'lodash';

import Select from '../../components/UI/Select';
import TemplateSelect from './templateSelect';
import ParentsSelect from './parentsSelect';

/**
 * `CreateSpace` is a React component for creating a new space or editing an existing one.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.existingEntries - An array of existing entries to select from.
 * @param {Function} props.modifySpaces - A function to modify the spaces.
 * @param {boolean} [props.isEditing=false] - A flag indicating whether the component is in editing mode.
 *
 * @example
 * <CreateSpace existingEntries={existingEntries} modifySpaces={modifySpaces} isEditing={isEditing} />
 *
 * @returns {React.Element} The rendered React element.
 */
export default function CreateSpace({ existingEntries, modifySpaces, isEditing, setIsEditing, prePopulatedData }) {
    const [name, setName] = useState('');
    const [template, setTemplate] = useState('template*');

    const [templates, setTemplates] = useState([]);

    const [parents, setParents] = useState([]);

    const reset = () => {
        setName('');
        setParents([]);
        setTemplate('');
    };

    useEffect(() => {
    // Check if 'existingEntries' is not null or undefined
        if (existingEntries) {
        // Update 'templates' state
            // Map existingEntries to an array of objects with 'name' and 'display' properties
            const mappedEntries = existingEntries.map(entry => {
                return {
                    name: entry?.template,
                    display: entry?.template,
                };
            });

            // Use lodash's 'uniqBy' function to create a unique array based on the 'name' property
            const uniqueEntries = _.uniqBy(mappedEntries, 'name');

            // Update 'templates' state
            setTemplates(uniqueEntries);
        }
    }, [existingEntries]); // Dependency array for useEffect, triggers the effect whenever 'existingEntries' changes

    useEffect(() => {
        if (prePopulatedData) {
            if (prePopulatedData?.name) setName(prePopulatedData?.name);

            if (prePopulatedData?.template) {
                setTemplate(prePopulatedData?.template);
            }

            if (prePopulatedData?.parentNames) setParents(prePopulatedData?.parentNames);
        }
    }, [prePopulatedData]);

    return (
        <>
            <button onClick={() => {setIsEditing(false); reset();}}>Back</button>
            <input onChange={(e) => {setName(e?.target?.value);}} value={name} required type="text" placeholder="name" />
            <input type="text" value="context" disabled />
            <TemplateSelect templates={templates} setTemplates={setTemplates} selectedTemplate={template} setSelectedTemplate={setTemplate} />
            <ParentsSelect existingEntries={existingEntries} setParents={setParents} parents={parents} />
            <button onClick={() => {
                if (name && template) {
                    modifySpaces(name, template, parents);
                    reset();
                    setIsEditing(false);
                } else {
                    alert('Name and template are required');
                }
            }}>
                { isEditing ? 'Save' : 'Create' }
            </button>
        </>

    );
}

