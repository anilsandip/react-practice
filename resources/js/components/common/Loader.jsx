import React from 'react';
import Loader from "react-loader-spinner";

export const LoaderComponent = () => {
    return (
        <div className="Loader_Spinner">
            <Loader
                type="ThreeDots"
                color="#2E6E52"
                height={100}
                width={100}
                timeout={0}
            />
        </div>
    );
};
