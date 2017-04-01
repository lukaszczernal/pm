import * as _ from 'lodash';

export function mergeJoin(
    [dest, src]: [any[], any],
    destMatch: string,
    srcMatch: string,
    destField: string = destMatch,
    srcField?: string
    ): any[] {

    if (_.isArray(src)) {
        src = _(src)
            .groupBy(srcMatch)
            .mapValues(srcItem => srcItem[0])
            .value();
    }

    dest.map(item => {
        let matchValue = item[destMatch];
        let srcValue = src[matchValue];

        if (srcValue) {
            item[destField] = srcField ? srcValue[srcField] : srcValue;
        }

        return item;
    });

    return dest;
}
