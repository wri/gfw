const buildPolynameSelects = () => {
    const allPolynames = forestTypes
        .concat(landCategories)
        .filter(p => !p.hidden);
    let polyString = '';
    allPolynames.forEach((p, i) => {
        const isLast = i === allPolynames.length - 1;
        polyString = polyString.concat(
            `sum(${p.value}) as ${p.value}${isLast ? '' : ', '}`
        );
    });

    return polyString;
};

const getRequestUrl = (adm0, adm1, adm2, grouped) => {
    const dataset = getAdmDatasetId(adm0, adm1, adm2, grouped);
    const REQUEST_URL = `${process.env.GFW_API}/query/{dataset}?sql=`;
    return REQUEST_URL.replace('{dataset}', dataset);
};

const getWHEREQuery = params => {
    const allPolynames = forestTypes
        .concat(landCategories)
        .filter(p => !p.hidden);
    const paramKeys = params && Object.keys(params);
    const paramKeysFiltered = paramKeys.filter(
        p => (params[p] || p === 'threshold') && ALLOWED_PARAMS.includes(p)
    );

    if (params) {
        let paramString = 'WHERE ';
        paramKeysFiltered.forEach((p, i) => {
            const isLast = paramKeysFiltered.length - 1 === i;
            const isPolyname = ['forestType', 'landCategory'].includes(p);
            const value = isPolyname ? 1 : params[p];
            const polynameMeta = allPolynames.find(
                pname => pname.value === params[p]
            );

            const polynameString = `
        ${isPolyname ? `${params[p]} is not "0"` : ''}${
                isPolyname &&
                    polynameMeta &&
                    polynameMeta.default &&
                    polynameMeta.categories
                    ? ` AND ${params[p]} ${polynameMeta.comparison || '='} '${
                    polynameMeta.default
                    }'`
                    : ''
                }${
                !isPolyname
                    ? `${p} = ${typeof value === 'number' ? value : `'${value}'`}`
                    : ''
                }${isLast ? '' : ' AND '}`;

            paramString = paramString.concat(polynameString);
        });
        return paramString;
    }
    return '';
};