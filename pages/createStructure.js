/**
 * This file defines a React component named CreateStructure for handling the creation of Matrix spaces.
 * It allows users to upload a JSON file, process the data, and generate Matrix spaces accordingly.
 * @module CreateStructure
 */

import styled from 'styled-components';
import React, { useState, useRef } from 'react';
import { Parser } from '@json2csv/plainjs';

import { useAuth } from '../lib/Auth';
import { handleMatrixRateLimit } from '../components/Utils';

const Highlight = styled.span`
  color: var(--color-hi);
`;

const ProcessStep = styled.section`
  margin-bottom: 1em;
`;

/**
 * CreateStructure functional React component for Matrix space creation.
 * @function
 * @returns {JSX.Element} The CreateStructure component.
 */

export default function CreateStructure() {
    const auth = useAuth();
    const matrixClient = auth.getAuthenticationProvider('matrix').getMatrixClient();

    const hiddenFileInput = useRef(null);

    const [structureFile, setStructureFile] = useState(null);
    const [validData, setValidData] = useState(false);
    const [structureInputData, setStructureInputData] = useState(null);

    const [generatedData, setGeneratedData] = useState(null);

    const [isGenerating, setIsGenerating] = useState(false);

    const [generatingStatus, setGeneratingStatus] = useState('');

    /**
     * Handles the file upload action by programmatically triggering a click event on the hidden file input element.
     *
     * @function
     */
    const handleUpload = () => {
        hiddenFileInput.current.click();
    };

    /**
     * Function to handle file input change and data validation.
     * @function
     * @param {Event} event - The input change event.
     */
    const handleChange = async (event) => {
        const fileUploaded = event.target.files[0];

        if (fileUploaded?.type !== 'application/json') return;

        if (event.target.files) {
            const parsedData = await readJsonFile(event.target.files[0]);
            parsedData && Array.isArray(parsedData) ? setValidData(true) : setValidData(false);
            setStructureInputData(parsedData);
        }
        setIsGenerating(false);
        setGeneratingStatus('');
        setGeneratedData(null);
        setStructureFile(fileUploaded);
    };

    // Function to read uploaded JSON file
    const readJsonFile = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = event => {
                if (event.target) {
                    resolve(JSON.parse(event.target.result));
                }
            };

            fileReader.onerror = error => reject(error);
            fileReader.readAsText(file);
        });
    };

    // Function to handle data generation
    const handleGenerate = async () => {
        setIsGenerating(true);

        let data = [];
        for (const entry of structureInputData) {
            const space = { ...entry };
            const createSpace = await createMatrixSpace(entry)
                .catch(error => {
                    return handleMatrixRateLimit(error, () => createMatrixSpace(entry));
                });
            space.id = createSpace.room_id;

            setGeneratingStatus(data.length + '/' + (structureInputData.length-1)*2);
            data.push(space);
        }
        data = await assignParentToChildren(data);

        setGeneratedData(data);
        setIsGenerating(false);
    };

    /**
     * Downloads the data as a JSON file with the specified format.
     * @function
     */
    const downloadFileAsJson = () => {
        const fileName = 'structure-export-'+ Date.now().toString();
        const json = JSON.stringify(generatedData.map(entry => {
            return {
                name: entry.name,
                id: entry.id,
                children: entry.children,
                persons: entry.persons,
                template: entry.template,
                type: entry.type,
            };
        }), null, 2);

        executeDownload(json, 'json', fileName);
    };

    /**
     * Downloads the data as a CSV file with the specified format.
     * @function
     */
    const downloadFileAsCsv = () => {
        const fileName = 'onboarding-export-'+ Date.now().toString();
        const csvData = [];
        generatedData.forEach(entry => {
            entry?.persons.forEach(person => {
                csvData.push({ id: entry.id, email: person.mail });
            });
        });

        try {
            const opts = {};
            const parser = new Parser(opts);
            const csv = parser.parse(csvData);

            executeDownload(csv, 'csv', fileName);
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Executes the download of data in the specified format and file name.
     * @function
     * @param {string} data - The data to be downloaded.
     * @param {string} type - The format/type of the file (e.g., 'json', 'csv').
     * @param {string} fileName - The desired name for the downloaded file.
     */
    const executeDownload = (data, type, fileName) => {
        const blob = new Blob([data], { type: 'application/'+type });
        const href = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = href;
        link.download = fileName + '.'+type;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };

    // Function to assign parents and children relationships
    const assignParentToChildren = async (data) => {
        let processCounter = 0;
        for (const primiary of data) {
            primiary.parents = [];
            for (const primiaryParent of primiary.parentNames) {
                for (const parent of data
                    .filter(ele => ele.name.trim().replace(' ', '') === primiaryParent.trim().replace(' ', ''))) {
                    const addSpaceChild = async () => {
                        await auth.getAuthenticationProvider('matrix').addSpaceChild(parent.id, primiary.id)
                            .catch(error => {
                                return handleMatrixRateLimit(error, () => addSpaceChild());
                            });
                    };
                    await addSpaceChild();
                    // safety timeout since synapse sometimess messes up otherwise.
                    await new Promise(r => setTimeout(r, 30));
                    primiary.parents.push(parent.id);
                }
            }
            processCounter++;
            setGeneratingStatus((data.length + processCounter) + '/' + (structureInputData.length-1)*2);
        }

        data.forEach(entry => {
            entry.children = [];
            data.forEach(potentialChild => {
                if (potentialChild.id !== entry.id) {
                    if (potentialChild.parents.includes(entry.id)) {
                        entry.children.push(potentialChild.id);
                    }
                }
            });
        });

        return data;
    };

    /**
     * Function to create a Matrix space based on provided data.
     * @function
     * @param {Object} data - The data used to create the Matrix space.
     * @returns {Promise<Object>} A Promise that resolves with the room object of the created Matrix space.
     */
    const createMatrixSpace = async (data) => {
        const opts = (type, template, name) => {
            return {
                preset: 'public_chat',
                power_level_content_override: {
                    ban: 50,
                    events: {
                        'm.room.avatar': 50,
                        'm.room.canonical_alias': 50,
                        'm.room.encryption': 100,
                        'm.room.history_visibility': 100,
                        'm.room.name': 50,
                        'm.room.power_levels': 50,
                        'm.room.server_acl': 100,
                        'm.room.tombstone': 100,
                        'm.space.child': 0,
                        'm.room.topic': 50,
                        'm.room.pinned_events': 50,
                        'm.reaction': 50,
                        'im.vector.modular.widgets': 50,
                    },
                    events_default: 50,
                    historical: 100,
                    invite: 50,
                    kick: 50,
                    redact: 50,
                    state_default: 50,
                    users_default: 0,
                },
                name: name,
                room_version: '10',
                creation_content: { type: 'm.space' },
                initial_state: [{
                    type: 'm.room.history_visibility',
                    content: { history_visibility: 'world_readable' }, //  history
                },
                {
                    type: 'dev.medienhaus.meta',
                    content: {
                        version: '0.3',
                        type: type,
                        template: template,
                        published: 'public',
                    },
                },
                {
                    type: 'm.room.guest_access',
                    state_key: '',
                    content: { guest_access: 'can_join' },
                }],
                visibility: 'private', // visibility is private even for public spaces.
            };
        };
        return await matrixClient.createRoom(opts(
            data.type ? data.type : 'context',
            data.template,
            data.name,
            'world_readable',
        ));
    };

    return (
        <>
            <ProcessStep>
                <h3>0. upload file</h3>
                <button onClick={handleUpload} disabled={isGenerating}>Upload json</button>
                <input accept=".json,application/json"
                    type="file"
                    onChange={handleChange}
                    ref={hiddenFileInput}
                    style={{ display: 'none' }}
                />
            </ProcessStep>

            { validData && <ProcessStep>
                <h3>1. about</h3>
                <button disabled={isGenerating || generatedData} onClick={handleGenerate}> { isGenerating ? generatingStatus : 'Generate' }</button>
                <p><span>Filename: </span>{ structureFile ? structureFile?.name : '' }</p>
                <p>this would generate <Highlight>{ structureInputData ? structureInputData.length : '' } </Highlight>[matrix] spaces</p>
            </ProcessStep> }

            { generatedData && <ProcessStep>
                <h3>2. report</h3>
                <button onClick={downloadFileAsJson}>
                    Export detailed report
                </button>
                <button onClick={downloadFileAsCsv}>
                    Export csv for 'matrix-email-onboarding' tool
                </button>
                <p><span>Generated matrix spaces: </span><Highlight>{ generatedData ? generatedData.length : '' }</Highlight></p>
                <p><span>Generated Root Id: </span><Highlight>{ generatedData[0].id ? generatedData[0].id : '' }</Highlight></p>
            </ProcessStep> }
        </>

    );
}

