export const isEmpty = (str) => {
  return str === null || str === undefined || str === "";
};

export const getEntityUrl = (asset) => {
  let apiBaseName = asset?.api?.baseName
    ? `/${API_BASE_NAME[asset?.api?.baseName]}`
    : "";
  return `${API_URL}${apiBaseName}/${APP_NAME}/${asset?.api?.url}`;
};
