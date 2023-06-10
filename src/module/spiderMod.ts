import cheerio from 'cheerio';

export module spider {
    export function getSessionCookie(html: string) {
        let htmlSplit = JSON.stringify(html).split(/[']/);

        let sessionId = htmlSplit[13];
        let userID = htmlSplit[19];
        let username = htmlSplit[25];
        let email = htmlSplit[31];
        
        return {sessionId, userID, username, email};
    };

    export function getCourseList(html: string) {
        let $ = cheerio.load(html);
        const result : Record<string, string>[] = new Array();

        $('#CourseDrop').find('option').each(function (i, elem) {
            let value = $(this).attr('value');
            let text = $(this).text();

            if (value != undefined && text != undefined){
                result[i] = { value, text };
            }
        });
    
        return result;
    };

    export function getCID(html: string) {
        return JSON.stringify(html).split(/[=,]/)[10];
    };

    export function getFileInfo(html: string) {
        let $ = cheerio.load(html);
        const result : any = {};

        $('input').each(function (i, elem) {
            let href = $(this).attr('name');
            let text = $(this).attr('value');
            if (href != undefined && text != undefined){
                result[href] = text;
            }
        });
    
        return result;
    };

    export function getFileName(html: string) {
        let $ = cheerio.load(html);

        let key = $('item').map((i, elem)=>{
            return $(elem).find('title').text().split(/[\t]/)[0];
        }).toArray();

        let value = $('resource resource').map((i, elem)=>{
            return $(elem).attr('href');
        }).toArray();

        let result: Record<string, string>[] = key.map((elem, i) =>{
            return ({key: elem, value: value[i]});
        });

        return result;
    };
}