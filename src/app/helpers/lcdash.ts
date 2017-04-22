import * as _ from 'lodash';

export function mergeJoin<T>(
    [dest, src]: [T[], any],
    destMatch: string,
    srcMatch: string,
    destField: string = destMatch,
    srcField?: string
    ): T[] {

    if (_.isArray(src)) {
        src = _(src)
            .groupBy(srcMatch)
            .mapValues(srcItem => srcItem[0])
            .value();
    }

    dest.map(item => {
        const matchValue = item[destMatch];
        const srcValue = src[matchValue];

        if (srcValue) {
            item[destField] = srcField ? srcValue[srcField] : srcValue;
        }

        return item;
    });

    return dest;
}
