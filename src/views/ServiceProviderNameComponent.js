import React from "react";

const ServiceProviderName = ({ ...props }) => {
  return !!props.name ? <p>{props.name}</p> : <p>Loading...</p>;
};

export default ServiceProviderName;
