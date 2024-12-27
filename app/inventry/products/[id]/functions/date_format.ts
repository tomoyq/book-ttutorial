import {format} from "date-fns";

export default function changeDateFormat(date: Date) {
    return format(date, 'yyyy-MM-dd HH:mm:ss')
};