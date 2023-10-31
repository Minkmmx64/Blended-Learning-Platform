import * as moment from "moment";

export const getDate = () => {
  return moment().format("YYYY-MM-DD");
}