
import styled from 'styled-components';
import React, { useState } from 'react';

const HirachyViewElement = styled.li`
  display: grid;
  grid-template-columns: 3fr 1fr;
`;

const ButtonSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1em;
`;

const StructureViewElement = ({ name, depth, setEdit, setCreate, deleteFunction, children = [] }) => {
    return (

        <>
            <HirachyViewElement>
                <div> <span>{ '-'.repeat(depth) }</span> { name }</div>
                <ButtonSection>
                    <button onClick={() => setCreate(name)}>➕</button>
                    <button onClick={() => setEdit(name)}>✏️</button>
                    <button onClick={() => deleteFunction(name)}>🗑️</button>
                </ButtonSection>

            </HirachyViewElement>
            { children && children.length > 0 && <ul>
                { children.map(child => <StructureViewElement key={child.name} name={child.name} depth={depth+1} deleteFunction={deleteFunction} setCreate={setCreate} setEdit={setEdit} children={child.children} />) }
            </ul> }

        </>

    );
};

export default StructureViewElement;
