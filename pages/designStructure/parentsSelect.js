import React, { useState } from 'react';
import styled from 'styled-components';

import TextButton from '../../components/UI/TextButton';
import Select from '../../components/UI/Select';

const AddNewParent = styled.section`
  display: grid;
  grid-template-columns: 3fr 1fr;
`;

const ParentListLi = styled.li`
  display: grid;
  grid-template-columns: 3fr 1fr;
  justify-content: end;
  margin-bottom: 1em;

  & > div {
    text-align: right;
  }

  & > div > button {
    display: inline;
  }
`;

/**
 * A component for selecting and adding parents.
 * @param {Object} props - The component props.
 * @param {Array} props.existingEntries - An array of existing entries to select from.
 * @param {Function} props.setParents - A function to set the selected parents.
 * @param {Array} props.parents - An array of currently selected parents.
 * @returns {React.Element} The rendered React element.
 */
const ParentsSelect = ({ existingEntries, setParents, parents }) => {
    const [selectedParent, setSelectedParent] = useState(null);

    const handleSelect = (value) => {
        setSelectedParent(value);
    };

    const handleAddParent = (value) => {
        if (selectedParent && !parents.includes(selectedParent)) {
            setParents(prevParents => [...prevParents, selectedParent]);
        }
    };

    return (
        <>
            <ParentsList parents={parents} setParents={setParents} />

            <AddNewParent>
                <Select
                    placeholderText="select parent "
                    options={
                        existingEntries.map(entry => {return { display: entry.name, name: entry.name };})
                    }
                    setSelectedValue={handleSelect}
                />
                <button onClick={handleAddParent}>add parent</button>
            </AddNewParent>
        </>
    );
};

/**
 * A component for displaying a list of parents.
 * @param {Object} props - The component props.
 * @param {Array} props.parents - An array of currently selected parents.
 * @param {Function} props.setParents - A function to set the selected parents.
 * @returns {JSX.Element} - The rendered component.
 */
const ParentsList = ({ parents, setParents }) => {
    /**
     * Removes a parent from the list of selected parents.
     * @param {string} parentToRemove - The parent to remove.
     */
    const removeParent = (parentToRemove) => {
        setParents(prevParents => prevParents.filter(parent => parent !== parentToRemove));
    };

    return (
        <>
            <h3>parents</h3>
            <ul>
                { parents.map((parent, index) => (
                    <ParentsListElement key={index} parent={parent} removeParent={removeParent} />
                )) }
            </ul>
        </>
    );
};

/**
 * A component for displaying a single parent in the list.
 * @param {Object} props - The component props.
 * @param {string} props.parent - The parent to display.
 * @param {Function} props.removeParent - A function to remove the parent from the list.
 * @returns {React.Element} The rendered React element.
 */
const ParentsListElement = ({ parent, removeParent }) => {
    return (
        <ParentListLi>
            { parent }
            <div>
                <TextButton onClick={() => removeParent(parent)}>🗑️</TextButton>
            </div>
        </ParentListLi>
    );
};

export default ParentsSelect;
