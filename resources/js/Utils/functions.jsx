export function setFormData(form, data){
    Object.keys(form).forEach((key)=>{
        if(data[key]!=undefined){
            form[key]=data[key];
        }
    })
}
