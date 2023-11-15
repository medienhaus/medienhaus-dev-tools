
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import StructureViewElement from './structureViewElement';

const StructureView = ({ data, setData, setEdit, setCreate, deleteEntry }) => {
    console.log(Date.now());
    const [nestedData, setNestedData] = useState([]);

    // const deleteElement = (name) => {
    //     const newData = { ...nestedData };

    //     const findParentOfElement = (element, parent) => {
    //         if (element.children) {
    //             if (element.children.some(child => child.name === name)) {
    //                 return element;
    //             } else {
    //                 for (const child of element.children) {
    //                     const result = findParentOfElement(child, element);

    //                     if (result) {
    //                         return result;
    //                     }
    //                 }
    //             }
    //         }

    //         return null;
    //     };

    //     const parent = findParentOfElement(newData, null);

    //     if (parent) {
    //         parent.children = parent.children.filter((element) => element.name !== name);
    //         setNestedData(newData);
    //     } else {
    //         console.log(`Element with name ${name} not found.`);
    //     }
    // };

    // useEffect(() => {
    //     const flatData = flattenData(nestedData);

    //     if (flatData.length !== data.length) {
    //         setData(flatData);
    //     }
    // }, [nestedData, setData, data]);

    useEffect(() => {
        const nestData = (flatData) => {
            if (!(flatData.length > 0)) {
                return {};
            }

            const root = { name: '', children: [] };

            const findNode = (name, node) => {
                if (node.name === name) {
                    return node;
                }

                if (node.children) {
                    for (const child of node.children) {
                        const foundNode = findNode(name, child);

                        if (foundNode) {
                            return foundNode;
                        }
                    }
                }

                return null;
            };

            for (const item of flatData) {
                let parentNode = root;

                if (item.parentNames && item.parentNames.length > 0) {
                    for (const parentName of item.parentNames) {
                        const foundNode = findNode(parentName, parentNode);

                        if (foundNode) {
                            parentNode = foundNode;
                        } else {
                            break;
                        }
                    }
                }

                if (!parentNode.children) {
                    parentNode.children = [];
                }

                parentNode.children.push({ name: item.name, children: [] });
            }

            return root.children[0];
        };

        const newNestedData = nestData(data);

        // const flattenData = (data) => {
        //     const result = [];

        //     const traverse = (node, parent) => {
        //         result.push({ name: node.name, parents: [parent], template: node.template, type: node.type });

        //         if (node.children) {
        //             node.children.forEach(child => traverse(child, node.name));
        //         }
        //     };

        //     traverse(data);

        //     return result;
        // };

        // if (data.length !== flattenData(nestedData).length) {
        //     console.log('data changed');
        //     setNestedData(newNestedData);
        // }

        setNestedData(newNestedData);
    }, [data]);

    return (
        <>
            <ul>
                <StructureViewElement name={nestedData.name} depth={0} children={nestedData.children} setEdit={setEdit} setCreate={setCreate} deleteFunction={deleteEntry} />
            </ul>
        </>

    );
};

export default StructureView;
