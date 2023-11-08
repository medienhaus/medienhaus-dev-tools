
import React, { useState } from 'react';
import _ from 'lodash';

/**
 * A custom select component that allows the user to select an option from a dropdown list.
 * @param {Object} props - The props object containing the following properties:
 * @param {string} props.placeholderText - The text to display as a placeholder when no option is selected.
 * @param {Array} props.options - An array of objects representing the options to display in the dropdown list.
 * @param {function} props.setSelectedValue - A callback function to be called when an option is selected.
 * @returns {JSX.Element} - A select element with options to choose from.
 */
export default function Select({ placeholderText, options, setSelectedValue }) {
    return (
        <select onChange={(e) => { setSelectedValue(e.target.value);}}>
            <option disabled selected>{ placeholderText }</option>
            { _.map(options, option => {
                return <option value={option?.name}>
                    { option?.display } { option?.description ? '—' : '' }  { option?.description }
                </option>;
            }) }
        </select>
    );
}
