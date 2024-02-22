User => signType ->    0= normal 
                        1= google 
                        2= apple

        loginType ->    0= mobile
                        1= email 


User Address => address -> 0 = home,
                            1 = work,



Order => shippingType ->  0 = pickUp
                          1 = delivery



** mongodb **

**download database in local machine 

-> mongodump --uri="mongodb+srv://yash-44:yash99245@cluster0.knrwpwz.mongodb.net/VB-OMC" --out="C:\VB-OMC_backup"

here--->  uri="cluster url/(database name)" 
                out="file path"


**upload in database from local machine 
-> mongorestore mongodb+srv://yash-44:yash99245@cluster0.knrwpwz.mongodb.net/ dump

here---> url of cluser and / (foldername)