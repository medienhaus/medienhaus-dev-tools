
import { map } from 'lodash';

/**
 * `Select` is a functional component that renders a select dropdown with options.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.placeholderText - The placeholder text to display when no option is selected.
 * @param {Array} props.options - The options to display in the dropdown. Each option is an object with `name`, `display`, and `description` properties.
 * @param {Function} props.setSelectedValue - The function to call when an option is selected. This function is passed the `name` of the selected option.
 * @param {string} props.selectedValue - The currently selected value. If this prop is provided, the dropdown will be a controlled component.
 *
 * @returns {JSX.Element} A select dropdown element.
 */
const Select = ({ placeholderText, options, setSelectedValue, selectedValue }) => {
    return (
        <select onChange={(e) => { setSelectedValue(e.target.value);}} value={selectedValue}>
            <option disabled>{ placeholderText }</option>
            { map(options, option => {
                return <option key={option.name} value={option?.name}>
                    { option?.display } { option?.description ? '—' : '' }  { option?.description }
                </option>;
            }) }
        </select>
    );
};

export default Select;
