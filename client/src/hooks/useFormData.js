import {useState} from 'react';

const useFormData = (initialData, action) => {
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setData({
            ...data, [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            return await action(data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetData = () => {
        setData(initialData);
    };

    return {
        data, handleChange, handleSubmit, resetData, isLoading,
    };
};

export default useFormData;
