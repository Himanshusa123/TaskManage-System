export const validateEmail=(email)=>{
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const addthousandseparators=(num)=>{
    if (num==null || isNaN(num)) {
        return " ";
    }
    const [intergerpart,fractionpart]=num.toString().split(".");
    const formattedintergerpart=intergerpart.replace(/\B(?=(\d{3})+(?!\d))/g,",");

    return fractionpart?`${formattedintergerpart}.${fractionpart}`:formattedintergerpart;
}