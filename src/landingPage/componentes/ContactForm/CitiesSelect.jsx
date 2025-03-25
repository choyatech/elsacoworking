import { useState } from "react";
import states from "../../../utils/mexico.json";

export default function CitiesSelect({ isDark = true }) {
  const [selectedState, setSelectedState] = useState("Aguascalientes");

  const labelClass = `block text-sm font-medium ${
    isDark ? "text-white" : "text-gray-900"
  }`;
  const selectClass = `p-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${
    isDark
      ? "bg-neutral-900 border-neutral-700 text-neutral-400 focus:ring-neutral-600"
      : "mt-1 w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition"
  } autofill:pt-6 autofill:pb-2`;

  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <div>
        <label htmlFor="state" className={labelClass}>
          Estado
        </label>
        <select
          id="state"
          name="state"
          className={selectClass}
          onChange={event => setSelectedState(event.target.value)}
        >
          {Object.keys(states).map(state => (
            <option key={state}>{state}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="city" className={labelClass}>
          Ciudad
        </label>
        <select id="township" name="township" className={selectClass}>
          {selectedState &&
            states[selectedState].map(city => (
              <option key={city}>{city}</option>
            ))}
        </select>
      </div>
    </div>
  );
}
