
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Parser } from '@json2csv/plainjs';
import { set } from 'lodash';

import CreateSpace from './createSpace';
import StructureView from './structureView';

const Highlight = styled.span`
  color: var(--color-hi);
`;

const ProcessStep = styled.section`
  margin-bottom: 1em;
`;

const ButtonSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;

  & > button {
    font-size: 0.5em;
  }
`;

export default function DesignStructure() {
    const [data, setData] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingExisting, setIsEditingExisting] = useState(false);

    const [prePopulatedDataForEdit, setPrePopulatedDataForEdit] = useState({});

    const modifySpaces = (name, template, parents) => {
        // Create a new object
        const newSpace = { name, template, parentNames: parents };

        // Check if an object with the same name already exists in the spacesList
        const existingSpaceIndex = data.findIndex(space => space.name === name);

        if (existingSpaceIndex !== -1) {
            // If it exists, update it
            setData(prevSpacesList => {
                const updatedSpacesList = [...prevSpacesList];
                updatedSpacesList[existingSpaceIndex] = newSpace;

                return updatedSpacesList;
            });
        } else {
            // If it doesn't exist, append the new object
            setData(prevSpacesList => [...prevSpacesList, newSpace]);
        }
    };

    useEffect(() => {
        console.log('dataList');
        console.log(data);
        console.log('dataListEnd');
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('api/examples');
            const jsonData = await response.json();
            setData(jsonData);
        };

        fetchData();
    }, [setData]);

    const editElement = (name) => {
        setIsEditing(true);
        setPrePopulatedDataForEdit(data.find(space => space.name === name));
    };

    const setCreate = (parent) => {
        setPrePopulatedDataForEdit({});
        setIsEditing(true);
        setPrePopulatedDataForEdit({ parentNames: [parent] });
    };

    const deleteEntry = (name) => {
        setData(prevData => prevData.filter(space => space.name !== name));
    };

    return (
        <>
            <ProcessStep>
                <h3>0. Choose workflow</h3>
                <ButtonSplit>
                    <button>Create new based on example</button>
                    <button>Upload existing json</button>
                </ButtonSplit>

                <input accept=".json,application/json"
                    type="file"
                    style={{ display: 'none' }}
                />
            </ProcessStep>

            <ProcessStep>
                <h3>1. Design your Structure</h3>

                { isEditing && <section>
                    <CreateSpace setIsEditing={setIsEditing} isEditingExisting={isEditingExisting} existingEntries={data} modifySpaces={modifySpaces} prePopulatedData={prePopulatedDataForEdit} />
                </section> }

                { !isEditing && <section>
                    <StructureView data={data} setData={setData} setCreate={setCreate} setEdit={editElement} deleteEntry={deleteEntry} />
                </section>
                }
            </ProcessStep>

            <ProcessStep>
                <h3>2. Export</h3>
                <p><span>The file would contain </span><Highlight>xxxx</Highlight> indiviual spaces</p>
                <button>Export as JSON</button>
            </ProcessStep>
        </>

    );
}
