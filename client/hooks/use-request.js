import axios from "axios";
import { useState } from "react";

/**
 * hook to make requests
 * and holds errors as JSX in case they occur
 */
const useRequest = ({ url, method, body, onSuccess }) => {
	const [errors, setErrors] = useState(null);

	const doRequest = async (props = {}) => {
		try {
			setErrors(null);
			const response = await axios[method](url, { ...body, ...props });
			if (onSuccess) onSuccess(response.data);
			return response.data;
		} catch (err) {
			setErrors(
				<div className="alert alert-danger">
					<h4> Ooopps....</h4>
					<ul className="my-0">
						{err.response.data.errors.map((err) => (
							<li key={err.message}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	};
	return { doRequest, errors };
};

export default useRequest;
