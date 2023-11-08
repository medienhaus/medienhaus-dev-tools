
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Parser } from '@json2csv/plainjs';
import lodash from 'lodash-es';
import deepdash from 'deepdash-es';

import CreateSpace from './createSpace';
import StructureView from './structureView';

const _ = deepdash(lodash);

const Highlight = styled.span`
  color: var(--color-hi);
`;

const ProcessStep = styled.section`
  margin-bottom: 1em;
`;

export default function DesignStructure() {
    const [spacesList, setSpacesList] = useState([]);

    const [data, setData] = useState([]);

    const modifySpaces = (name, template, parents) => {
        // Create a new object
        const newSpace = { name, template, parents };

        // Check if an object with the same name already exists in the spacesList
        const existingSpaceIndex = spacesList.findIndex(space => space.name === name);

        if (existingSpaceIndex !== -1) {
            // If it exists, update it
            setSpacesList(prevSpacesList => {
                const updatedSpacesList = [...prevSpacesList];
                updatedSpacesList[existingSpaceIndex] = newSpace;
                return updatedSpacesList;
            });
        } else {
            // If it doesn't exist, append the new object
            setSpacesList(prevSpacesList => [...prevSpacesList, newSpace]);
        }

        console.log(spacesList);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('api/examples');
            const jsonData = await response.json();
            setData(jsonData);
        };
        fetchData();
    }, []);

    return (
        <>
            <ProcessStep>
                <h3>0. Choose workflow</h3>
                <button>Create new from scratch</button>
                <button>Upload existing json</button>
                <input accept=".json,application/json"
                    type="file"
                    style={{ display: 'none' }}
                />
            </ProcessStep>

            <ProcessStep>
                <h3>1. Design your Structure</h3>

                <section>
                    <CreateSpace existingEntries={data} modifySpaces={modifySpaces} />
                </section>

                <section>
                    <StructureView data={data} />
                </section>
            </ProcessStep>

            <ProcessStep>
                <h3>2. Export</h3>
                <p><span>The file would contain </span><Highlight>xxxx</Highlight> indiviual spaces</p>
                <button>Export as JSON</button>
            </ProcessStep>
        </>

    );
}

