export const dateFormat = (dateString) => {
// Date 객체로 변환
var date = new Date(dateString);
// 원하는 형식으로 날짜 및 시간을 문자열로 변환
var formattedDate = `${date.getFullYear()}년 ${("0" + (date.getMonth() + 1)).slice(-2)}월 ${("0" + date.getDate()).slice(-2)}일 ${("0" + date.getHours()).slice(-2)}시${("0" + date.getMinutes()).slice(-2)}분`;
return formattedDate;
}
