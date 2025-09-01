import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import * as logo from './mylogo.js';

@Injectable({
  providedIn: 'root'
})
export class ExceljsAviosRotuladoService {

  constructor() {
  }


  public exportExcel(excelData) {

    //Title, Header & Data




    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    const encabezado = excelData.encabezado;
    const cliente = excelData.cliente
    var abc = 64
    //var abc2 = 64
    var abcIni = ''
    var abcFin = ''
    //var abcIni2 = ''
    for (let i = 0; i < header.length; i++) {
      abc = abc + 1
      //abc2 = abc2 + 1
      if (i == 0) {
        abcIni = String.fromCharCode(Number(abc))
        //abcIni2 = String.fromCharCode(Number(abc2))
      }
      /*if(abc == 90){
        abc2 = 64 
      }*/
    }
    abcFin = String.fromCharCode(Number(abc))


    var abcIni2 = ''
    var abcFin2 = ''
    //var abcIni2 = ''
    for (let i = 0; i < header.length; i++) {
      abc = abc + 1
      //abc2 = abc2 + 1
      if (i == 0) {
        abcIni2 = String.fromCharCode(Number(abc))
        //abcIni2 = String.fromCharCode(Number(abc2))
      }
      /*if(abc == 90){
        abc2 = 64 
      }*/
    }
    abcFin2 = String.fromCharCode(Number(abc))

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(title);

  

    //Add Row and formatting
/*
    worksheet.mergeCells('C1', 'G4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '000000' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
*/
    // Date
/*
    worksheet.mergeCells('H1:L4');
    let d = new Date();
    let date = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('H1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }
  */

    //Add Image
/*
    worksheet.mergeCells('A1:B4');
    let myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'jpeg',
    });
    worksheet.addImage(myLogoImage, 'A1:B3');
*/

    //let imageRow = worksheet.getCell('A1');
    //imageRow.alignment = { vertical: 'middle', horizontal: 'center' }

    //Blank Row 
    //worksheet.addRow([]);
    
    

    //worksheet.autoFilter = 'A5:L5';
    
   

    var i = 1;
    var f = 1;
    var fc = 0;
    var hc = 0;
    var PrimeraArticulo="";
    console.log("data: ", data);
    data.forEach((row: any) => {   

    if(i==1){
      var letraI='A';
      var letraF='B';
      var encabI='A';
      var encabF='C';
    }else{
      var letraI='E';
      var letraF='F';
      var encabI='E';
      var encabF='G';
    }
    if(f==1 || f==2){fc=2; hc=1;}
    if(f==3 || f==4){fc=11; hc=10;}
    if(f==5 || f==6){fc=20; hc=19;}
    if(f==7 || f==8){fc=29; hc=28;}
    if(f==9 || f==10){fc=38; hc=37;}
    if(f==11 || f==12){fc=47; hc=46;}
    if(f==13 || f==14){fc=56; hc=55;}
    if(f==15 || f==16){fc=65; hc=64;}
    if(f==17 || f==18){fc=74; hc=73;}
    if(f==19 || f==20){fc=83; hc=82;}
    if(f==21 || f==22){fc=92; hc=91;}
    if(f==23 || f==24){fc=101; hc=100;}
    if(f==25 || f==26){fc=110; hc=109;}
    if(f==27 || f==28){fc=119; hc=118;}
    if(f==29 || f==30){fc=128; hc=127;}
    if(f==31 || f==32){fc=137; hc=136;}
    if(f==33 || f==34){fc=146; hc=145;}
    if(f==35 || f==36){fc=155; hc=154;}
    if(f==37 || f==38){fc=164; hc=163;}
    if(f==39 || f==40){fc=173; hc=172;}
    if(f==41 || f==42){fc=182; hc=181;}
    if(f==43 || f==44){fc=191; hc=190;}
    if(f==45 || f==46){fc=200; hc=199;}
    if(f==47 || f==48){fc=209; hc=208;}
    if(f==49 || f==50){fc=218; hc=217;}
    if(f==51 || f==52){fc=227; hc=226;}
    if(f==53 || f==54){fc=236; hc=235;}
    if(f==55 || f==56){fc=245; hc=244;}
    if(f==57 || f==58){fc=254; hc=253;}
    if(f==59 || f==60){fc=263; hc=262;}
    if(f==61 || f==62){fc=272; hc=271;}
    if(f==63 || f==64){fc=281; hc=280;}
    if(f==65 || f==66){fc=290; hc=289;}
    if(f==67 || f==68){fc=299; hc=298;}
    if(f==69 || f==70){fc=308; hc=307;}
    if(f==71 || f==72){fc=317; hc=316;}
    if(f==73 || f==74){fc=326; hc=325;}
    if(f==75 || f==76){fc=335; hc=334;}
    if(f==77 || f==78){fc=344; hc=343;}
    if(f==79 || f==80){fc=353; hc=352;}
    if(f==81 || f==82){fc=362; hc=361;}
    if(f==83 || f==84){fc=371; hc=370;}
    if(f==85 || f==86){fc=380; hc=379;}
    if(f==87 || f==88){fc=389; hc=388;}
    if(f==89 || f==90){fc=398; hc=397;}
    if(f==91 || f==92){fc=407; hc=406;}
    if(f==93 || f==94){fc=416; hc=415;}
    if(f==95 || f==96){fc=425; hc=424;}
    if(f==97 || f==98){fc=434; hc=433;}
    if(f==99 || f==100){fc=443; hc=442;}
    if(f==101 || f==102){fc=452; hc=451;}
    if(f==103 || f==104){fc=461; hc=460;}
    if(f==105 || f==106){fc=470; hc=469;}
    if(f==107 || f==108){fc=479; hc=478;}
    if(f==109 || f==110){fc=488; hc=487;}
    if(f==111 || f==112){fc=497; hc=496;}
    if(f==113 || f==114){fc=506; hc=505;}
    if(f==115 || f==116){fc=515; hc=514;}
    if(f==117 || f==118){fc=524; hc=523;}
    if(f==119 || f==120){fc=533; hc=532;}
    if(f==121 || f==122){fc=542; hc=541;}
    if(f==123 || f==124){fc=551; hc=550;}
    if(f==125 || f==126){fc=560; hc=559;}
    if(f==127 || f==128){fc=569; hc=568;}
    if(f==129 || f==130){fc=578; hc=577;}
    if(f==131 || f==132){fc=587; hc=586;}
    if(f==133 || f==134){fc=596; hc=595;}
    if(f==135 || f==136){fc=605; hc=604;}
    if(f==137 || f==138){fc=614; hc=613;}
    if(f==139 || f==140){fc=623; hc=622;}
    if(f==141 || f==142){fc=632; hc=631;}
    if(f==143 || f==144){fc=641; hc=640;}
    if(f==145 || f==146){fc=650; hc=649;}
    if(f==147 || f==148){fc=659; hc=658;}
    if(f==149 || f==150){fc=668; hc=667;}
    if(f==151 || f==152){fc=677; hc=676;}
    if(f==153 || f==154){fc=686; hc=685;}
    if(f==155 || f==156){fc=695; hc=694;}
    if(f==157 || f==158){fc=704; hc=703;}
    if(f==159 || f==160){fc=713; hc=712;}
    if(f==161 || f==162){fc=722; hc=721;}
    if(f==163 || f==164){fc=731; hc=730;}
    if(f==165 || f==166){fc=740; hc=739;}
    if(f==167 || f==168){fc=749; hc=748;}
    if(f==169 || f==170){fc=758; hc=757;}
    if(f==171 || f==172){fc=767; hc=766;}
    if(f==173 || f==174){fc=776; hc=775;}
    if(f==175 || f==176){fc=785; hc=784;}
    if(f==177 || f==178){fc=794; hc=793;}
    if(f==179 || f==180){fc=803; hc=802;}
    if(f==181 || f==182){fc=812; hc=811;}
    if(f==183 || f==184){fc=821; hc=820;}
    if(f==185 || f==186){fc=830; hc=829;}
    if(f==187 || f==188){fc=839; hc=838;}
    if(f==189 || f==190){fc=848; hc=847;}
    if(f==191 || f==192){fc=857; hc=856;}
    if(f==193 || f==194){fc=866; hc=865;}
    if(f==195 || f==196){fc=875; hc=874;}
    if(f==197 || f==198){fc=884; hc=883;}
    if(f==199 || f==200){fc=893; hc=892;}
    if(f==201 || f==202){fc=902; hc=901;}
    if(f==203 || f==204){fc=911; hc=910;}
    if(f==205 || f==206){fc=920; hc=919;}
    if(f==207 || f==208){fc=929; hc=928;}
    if(f==209 || f==210){fc=938; hc=937;}
    if(f==211 || f==212){fc=947; hc=946;}
    if(f==213 || f==214){fc=956; hc=955;}
    if(f==215 || f==216){fc=965; hc=964;}
    if(f==217 || f==218){fc=974; hc=973;}
    if(f==219 || f==220){fc=983; hc=982;}
    if(f==221 || f==222){fc=992; hc=991;}
    if(f==223 || f==224){fc=1001; hc=1000;}
    if(f==225 || f==226){fc=1010; hc=1009;}
    if(f==227 || f==228){fc=1019; hc=1018;}
    if(f==229 || f==230){fc=1028; hc=1027;}
    if(f==231 || f==232){fc=1037; hc=1036;}
    if(f==233 || f==234){fc=1046; hc=1045;}
    if(f==235 || f==236){fc=1055; hc=1054;}
    if(f==237 || f==238){fc=1064; hc=1063;}
    if(f==239 || f==240){fc=1073; hc=1072;}
    if(f==241 || f==242){fc=1082; hc=1081;}
    if(f==243 || f==244){fc=1091; hc=1090;}
    if(f==245 || f==246){fc=1100; hc=1099;}
    if(f==247 || f==248){fc=1109; hc=1108;}
    if(f==249 || f==250){fc=1118; hc=1117;}
    if(f==251 || f==252){fc=1127; hc=1126;}
    if(f==253 || f==254){fc=1136; hc=1135;}
    if(f==255 || f==256){fc=1145; hc=1144;}
    if(f==257 || f==258){fc=1154; hc=1153;}
    if(f==259 || f==260){fc=1163; hc=1162;}
    if(f==261 || f==262){fc=1172; hc=1171;}
    if(f==263 || f==264){fc=1181; hc=1180;}
    if(f==265 || f==266){fc=1190; hc=1189;}
    if(f==267 || f==268){fc=1199; hc=1198;}
    if(f==269 || f==270){fc=1208; hc=1207;}
    if(f==271 || f==272){fc=1217; hc=1216;}
    if(f==273 || f==274){fc=1226; hc=1225;}
    if(f==275 || f==276){fc=1235; hc=1234;}
    if(f==277 || f==278){fc=1244; hc=1243;}
    if(f==279 || f==280){fc=1253; hc=1252;}
    if(f==281 || f==282){fc=1262; hc=1261;}
    if(f==283 || f==284){fc=1271; hc=1270;}
    if(f==285 || f==286){fc=1280; hc=1279;}
    if(f==287 || f==288){fc=1289; hc=1288;}
    if(f==289 || f==290){fc=1298; hc=1297;}
    if(f==291 || f==292){fc=1307; hc=1306;}
    if(f==293 || f==294){fc=1316; hc=1315;}
    if(f==295 || f==296){fc=1325; hc=1324;}
    if(f==297 || f==298){fc=1334; hc=1333;}
    if(f==299 || f==300){fc=1343; hc=1342;}
    if(f==301 || f==302){fc=1352; hc=1351;}
    if(f==303 || f==304){fc=1361; hc=1360;}
    if(f==305 || f==306){fc=1370; hc=1369;}
    if(f==307 || f==308){fc=1379; hc=1378;}
    if(f==309 || f==310){fc=1388; hc=1387;}
    if(f==311 || f==312){fc=1397; hc=1396;}
    if(f==313 || f==314){fc=1406; hc=1405;}
    if(f==315 || f==316){fc=1415; hc=1414;}
    if(f==317 || f==318){fc=1424; hc=1423;}
    if(f==319 || f==320){fc=1433; hc=1432;}
    if(f==321 || f==322){fc=1442; hc=1441;}
    if(f==323 || f==324){fc=1451; hc=1450;}
    if(f==325 || f==326){fc=1460; hc=1459;}
    if(f==327 || f==328){fc=1469; hc=1468;}
    if(f==329 || f==330){fc=1478; hc=1477;}
    if(f==331 || f==332){fc=1487; hc=1486;}
    if(f==333 || f==334){fc=1496; hc=1495;}
    if(f==335 || f==336){fc=1505; hc=1504;}
    if(f==337 || f==338){fc=1514; hc=1513;}
    if(f==339 || f==340){fc=1523; hc=1522;}
    if(f==341 || f==342){fc=1532; hc=1531;}
    if(f==343 || f==344){fc=1541; hc=1540;}
    if(f==345 || f==346){fc=1550; hc=1549;}
    if(f==347 || f==348){fc=1559; hc=1558;}
    if(f==349 || f==350){fc=1568; hc=1567;}
    if(f==351 || f==352){fc=1577; hc=1576;}
    if(f==353 || f==354){fc=1586; hc=1585;}
    if(f==355 || f==356){fc=1595; hc=1594;}
    if(f==357 || f==358){fc=1604; hc=1603;}
    if(f==359 || f==360){fc=1613; hc=1612;}
    if(f==361 || f==362){fc=1622; hc=1621;}
    if(f==363 || f==364){fc=1631; hc=1630;}
    if(f==365 || f==366){fc=1640; hc=1639;}
    if(f==367 || f==368){fc=1649; hc=1648;}
    if(f==369 || f==370){fc=1658; hc=1657;}
    if(f==371 || f==372){fc=1667; hc=1666;}
    if(f==373 || f==374){fc=1676; hc=1675;}
    if(f==375 || f==376){fc=1685; hc=1684;}
    if(f==377 || f==378){fc=1694; hc=1693;}
    if(f==379 || f==380){fc=1703; hc=1702;}
    if(f==381 || f==382){fc=1712; hc=1711;}
    if(f==383 || f==384){fc=1721; hc=1720;}
    if(f==385 || f==386){fc=1730; hc=1729;}
    if(f==387 || f==388){fc=1739; hc=1738;}
    if(f==389 || f==390){fc=1748; hc=1747;}
    if(f==391 || f==392){fc=1757; hc=1756;}
    if(f==393 || f==394){fc=1766; hc=1765;}
    if(f==395 || f==396){fc=1775; hc=1774;}
    if(f==397 || f==398){fc=1784; hc=1783;}
    if(f==399 || f==400){fc=1793; hc=1792;}
    if(f==401 || f==402){fc=1802; hc=1801;}
    if(f==403 || f==404){fc=1811; hc=1810;}
    if(f==405 || f==406){fc=1820; hc=1819;}
    if(f==407 || f==408){fc=1829; hc=1828;}
    if(f==409 || f==410){fc=1838; hc=1837;}
    if(f==411 || f==412){fc=1847; hc=1846;}
    if(f==413 || f==414){fc=1856; hc=1855;}
    if(f==415 || f==416){fc=1865; hc=1864;}
    if(f==417 || f==418){fc=1874; hc=1873;}
    if(f==419 || f==420){fc=1883; hc=1882;}
    if(f==421 || f==422){fc=1892; hc=1891;}
    if(f==423 || f==424){fc=1901; hc=1900;}
    if(f==425 || f==426){fc=1910; hc=1909;}
    if(f==427 || f==428){fc=1919; hc=1918;}
    if(f==429 || f==430){fc=1928; hc=1927;}
    if(f==431 || f==432){fc=1937; hc=1936;}
    if(f==433 || f==434){fc=1946; hc=1945;}
    if(f==435 || f==436){fc=1955; hc=1954;}
    if(f==437 || f==438){fc=1964; hc=1963;}
    if(f==439 || f==440){fc=1973; hc=1972;}
    if(f==441 || f==442){fc=1982; hc=1981;}
    if(f==443 || f==444){fc=1991; hc=1990;}
    if(f==445 || f==446){fc=2000; hc=1999;}
    if(f==447 || f==448){fc=2009; hc=2008;}
    if(f==449 || f==450){fc=2018; hc=2017;}
    if(f==451 || f==452){fc=2027; hc=2026;}
    if(f==453 || f==454){fc=2036; hc=2035;}
    if(f==455 || f==456){fc=2045; hc=2044;}
    if(f==457 || f==458){fc=2054; hc=2053;}
    if(f==459 || f==460){fc=2063; hc=2062;}
    if(f==461 || f==462){fc=2072; hc=2071;}
    if(f==463 || f==464){fc=2081; hc=2080;}
    if(f==465 || f==466){fc=2090; hc=2089;}
    if(f==467 || f==468){fc=2099; hc=2098;}
    if(f==469 || f==470){fc=2108; hc=2107;}
    if(f==471 || f==472){fc=2117; hc=2116;}
    if(f==473 || f==474){fc=2126; hc=2125;}
    if(f==475 || f==476){fc=2135; hc=2134;}
    if(f==477 || f==478){fc=2144; hc=2143;}
    if(f==479 || f==480){fc=2153; hc=2152;}
    if(f==481 || f==482){fc=2162; hc=2161;}
    if(f==483 || f==484){fc=2171; hc=2170;}
    if(f==485 || f==486){fc=2180; hc=2179;}
    if(f==487 || f==488){fc=2189; hc=2188;}
    if(f==489 || f==490){fc=2198; hc=2197;}
    if(f==491 || f==492){fc=2207; hc=2206;}
    if(f==493 || f==494){fc=2216; hc=2215;}
    if(f==495 || f==496){fc=2225; hc=2224;}
    if(f==497 || f==498){fc=2234; hc=2233;}
    if(f==499 || f==500){fc=2243; hc=2242;}
    if(f==501 || f==502){fc=2252; hc=2251;}

    PrimeraArticulo = '';

     

      if(row["Articulo"].length>0){
        PrimeraArticulo = row["Articulo"].substring(0,1);
        if(PrimeraArticulo!=='H'){
          worksheet.mergeCells(encabI+hc, encabF+hc);
          let titleRow = worksheet.getCell(encabI+hc);
          titleRow.value ='OTROS AVIOS'
          titleRow.font = {
            name: 'Calibri',
            size: 10,   
            bold: true
          }
          titleRow.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          }
          titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
          
          let LiquidacionRow = worksheet.getCell(letraI+fc);
          LiquidacionRow.value = "CLIENTE"
          LiquidacionRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          LiquidacionRow.alignment = { vertical: 'middle', horizontal: 'left' }
          LiquidacionRow.border = {
            left: {style:'thin'}
          }
       
      
          let valorLiquidacionRow = worksheet.getCell(letraF+fc);
          valorLiquidacionRow.value = cliente
          valorLiquidacionRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          LiquidacionRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
          let OPRow = worksheet.getCell(letraI+(fc+1));
          OPRow.value = "OP"
          OPRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          OPRow.alignment = { vertical: 'middle', horizontal: 'left' }
          OPRow.border = {
            left: {style:'thin'}
          }
      
          let valorOPRow = worksheet.getCell(letraF+(fc+1));
          valorOPRow.value = row["OPEstilo"]
          valorOPRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorOPRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
          
      
          let ItemRow = worksheet.getCell(letraI+(fc+2));
          ItemRow.value = "DESCRIPCION"
          ItemRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          ItemRow.alignment = { vertical: 'middle', horizontal: 'left' }
          ItemRow.border = {
            left: {style:'thin'}
          }
      
      
          let valorItemRow = worksheet.getCell(letraF+(fc+2));
          valorItemRow.value = row["Descripcion"]
          valorItemRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorItemRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
      
      
          
          let MarcaRow = worksheet.getCell(letraI+(fc+3));
          MarcaRow.value = "TALLA/MEDIDA"
          MarcaRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          MarcaRow.alignment = { vertical: 'middle', horizontal: 'left' }
          MarcaRow.border = {
            left: {style:'thin'}
          }
          let valorMarcaRow = worksheet.getCell(letraF+(fc+3));
          valorMarcaRow.value = row["Talla"]
          valorMarcaRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorMarcaRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
      
      
          
          let ColorRow = worksheet.getCell(letraI+(fc+4));
          ColorRow.value = "COLOR"
          ColorRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          ColorRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
          ColorRow.border = {
            left: {style:'thin'}
          }
          let valorColorRow = worksheet.getCell(letraF+(fc+4));
          valorColorRow.value = row["Color"]
          valorColorRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorColorRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
      
      
          
          let CantidadRow = worksheet.getCell(letraI+(fc+5));
          CantidadRow.value = "CANTIDAD"
          CantidadRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          CantidadRow.alignment = { vertical: 'middle', horizontal: 'left' }
          CantidadRow.border = {
            left: {style:'thin'}
          }
          let valorCantidadRow = worksheet.getCell(letraF+(fc+5));
          valorCantidadRow.value = row["Cantidad"]
          valorCantidadRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorCantidadRow.alignment = { vertical: 'middle', horizontal: 'right' }
      
      
          let EstadoRow = worksheet.getCell(letraI+(fc+6));
          EstadoRow.value = "ESTADO"
          EstadoRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          EstadoRow.alignment = { vertical: 'middle', horizontal: 'left' }
          EstadoRow.border = {
            left: {style:'thin'},
            bottom: {style:'thin'}
          }
          let valorEstadoRow = worksheet.getCell(letraF+(fc+6));
          valorEstadoRow.value = row["Estado"]
          valorEstadoRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorEstadoRow.alignment = { vertical: 'middle', horizontal: 'left' }
          valorEstadoRow.border = { 
            bottom: {style:'thin'}
          }
      
          
          let b1Row = worksheet.getCell(encabF+fc);
          b1Row.border = {
            right: {style:'thin'}
          }
          let b2Row = worksheet.getCell(encabF+(fc+1));
          b2Row.border = {
            right: {style:'thin'}
          }
          let b3Row = worksheet.getCell(encabF+(fc+2));
          b3Row.border = {
            right: {style:'thin'}
          }
          let b4Row = worksheet.getCell(encabF+(fc+3));
          b4Row.border = {
            right: {style:'thin'}
          }
          let b5Row = worksheet.getCell(encabF+(fc+4));
          b5Row.border = {
            right: {style:'thin'}
          }
          let b6bRow = worksheet.getCell(encabF+(fc+5));
          b6bRow.border = {
            right: {style:'thin'}
          }
          let b7dow = worksheet.getCell(encabF+(fc+6));
          b7dow.border = {
            right: {style:'thin'},
            bottom: {style:'thin'}
          }
          
          if(i==2){i=1}else{i++;}
          f++;
        }else{
          worksheet.mergeCells(encabI+hc, encabF+hc);
          let titleRow = worksheet.getCell(encabI+hc);
          titleRow.value ='HILOS'
          titleRow.font = {
            name: 'Calibri',
            size: 10,   
            bold: true
          }
          titleRow.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          }
          titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
            
          let LiquidacionRow = worksheet.getCell(letraI+fc);
          LiquidacionRow.value = "CLIENTE"
          LiquidacionRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          LiquidacionRow.alignment = { vertical: 'middle', horizontal: 'left' }
          LiquidacionRow.border = {
            left: {style:'thin'}
          }
       
      
          let valorLiquidacionRow = worksheet.getCell(letraF+fc);
          valorLiquidacionRow.value = cliente
          valorLiquidacionRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          LiquidacionRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
          let OPRow = worksheet.getCell(letraI+(fc+1));
          OPRow.value = "OP"
          OPRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          OPRow.alignment = { vertical: 'middle', horizontal: 'left' }
          OPRow.border = {
            left: {style:'thin'}
          }
      
          let valorOPRow = worksheet.getCell(letraF+(fc+1));
          valorOPRow.value = row["OPEstilo"]
          valorOPRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorOPRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
          
      
          let ItemRow = worksheet.getCell(letraI+(fc+2));
          ItemRow.value = "CODIGO ITEM"
          ItemRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          ItemRow.alignment = { vertical: 'middle', horizontal: 'left' }
          ItemRow.border = {
            left: {style:'thin'}
          }
      
      
          let valorItemRow = worksheet.getCell(letraF+(fc+2));
          valorItemRow.value = row["Articulo"]
          valorItemRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorItemRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
      
      
          
          let MarcaRow = worksheet.getCell(letraI+(fc+3));
          MarcaRow.value = "MARCA"
          MarcaRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          MarcaRow.alignment = { vertical: 'middle', horizontal: 'left' }
          MarcaRow.border = {
            left: {style:'thin'}
          }
          let valorMarcaRow = worksheet.getCell(letraF+(fc+3));
          valorMarcaRow.value = row["Marca"]
          valorMarcaRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorMarcaRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
      
      
          
          let ColorRow = worksheet.getCell(letraI+(fc+4));
          ColorRow.value = "CODIGO COLOR"
          ColorRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          ColorRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
          ColorRow.border = {
            left: {style:'thin'}
          }
          let valorColorRow = worksheet.getCell(letraF+(fc+4));
          valorColorRow.value = row["CodColor"]
          valorColorRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorColorRow.alignment = { vertical: 'middle', horizontal: 'left' }
      
      
      
          
          let CantidadRow = worksheet.getCell(letraI+(fc+5));
          CantidadRow.value = "CANTIDAD"
          CantidadRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          CantidadRow.alignment = { vertical: 'middle', horizontal: 'left' }
          CantidadRow.border = {
            left: {style:'thin'}
          }
          let valorCantidadRow = worksheet.getCell(letraF+(fc+5));
          valorCantidadRow.value = row["Cantidad"]
          valorCantidadRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorCantidadRow.alignment = { vertical: 'middle', horizontal: 'right' }
      
      
          let EstadoRow = worksheet.getCell(letraI+(fc+6));
          EstadoRow.value = "ESTADO"
          EstadoRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          EstadoRow.alignment = { vertical: 'middle', horizontal: 'left' }
          EstadoRow.border = {
            left: {style:'thin'},
            bottom: {style:'thin'}
          }
          let valorEstadoRow = worksheet.getCell(letraF+(fc+6));
          valorEstadoRow.value = row["Estado"]
          valorEstadoRow.font = {
            name: 'Calibri',
            size: 9,   
            bold: true 
          }
          valorEstadoRow.alignment = { vertical: 'middle', horizontal: 'left' }
          valorEstadoRow.border = { 
            bottom: {style:'thin'}
          }
      
          
          let b1Row = worksheet.getCell(encabF+fc);
          b1Row.border = {
            right: {style:'thin'}
          }
          let b2Row = worksheet.getCell(encabF+(fc+1));
          b2Row.border = {
            right: {style:'thin'}
          }
          let b3Row = worksheet.getCell(encabF+(fc+2));
          b3Row.border = {
            right: {style:'thin'}
          }
          let b4Row = worksheet.getCell(encabF+(fc+3));
          b4Row.border = {
            right: {style:'thin'}
          }
          let b5Row = worksheet.getCell(encabF+(fc+4));
          b5Row.border = {
            right: {style:'thin'}
          }
          let b6bRow = worksheet.getCell(encabF+(fc+5));
          b6bRow.border = {
            right: {style:'thin'}
          }
          let b7dow = worksheet.getCell(encabF+(fc+6));
          b7dow.border = {
            right: {style:'thin'},
            bottom: {style:'thin'}
          }
          
          if(i==2){i=1}else{i++;}
          f++;
        }
      }else{

        worksheet.mergeCells(encabI+hc, encabF+hc);
        let titleRow = worksheet.getCell(encabI+hc);
        titleRow.value ='OTROS AVIOS'
        titleRow.font = {
          name: 'Calibri',
          size: 10,   
          bold: true
        }
        titleRow.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        }
        titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
        
        let LiquidacionRow = worksheet.getCell(letraI+fc);
        LiquidacionRow.value = "CLIENTE"
        LiquidacionRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        LiquidacionRow.alignment = { vertical: 'middle', horizontal: 'left' }
        LiquidacionRow.border = {
          left: {style:'thin'}
        }
     
    
        let valorLiquidacionRow = worksheet.getCell(letraF+fc);
        valorLiquidacionRow.value = cliente
        valorLiquidacionRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        LiquidacionRow.alignment = { vertical: 'middle', horizontal: 'left' }
    
        let OPRow = worksheet.getCell(letraI+(fc+1));
        OPRow.value = "OP"
        OPRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        OPRow.alignment = { vertical: 'middle', horizontal: 'left' }
        OPRow.border = {
          left: {style:'thin'}
        }
    
        let valorOPRow = worksheet.getCell(letraF+(fc+1));
        valorOPRow.value = row["OPEstilo"]
        valorOPRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        valorOPRow.alignment = { vertical: 'middle', horizontal: 'left' }
    
        
    
        let ItemRow = worksheet.getCell(letraI+(fc+2));
        ItemRow.value = "DESCRIPCION"
        ItemRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        ItemRow.alignment = { vertical: 'middle', horizontal: 'left' }
        ItemRow.border = {
          left: {style:'thin'}
        }
    
    
        let valorItemRow = worksheet.getCell(letraF+(fc+2));
        valorItemRow.value = row["Descripcion"]
        valorItemRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        valorItemRow.alignment = { vertical: 'middle', horizontal: 'left' }
    
    
    
        
        let MarcaRow = worksheet.getCell(letraI+(fc+3));
        MarcaRow.value = "TALLA/MEDIDA"
        MarcaRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        MarcaRow.alignment = { vertical: 'middle', horizontal: 'left' }
        MarcaRow.border = {
          left: {style:'thin'}
        }
        let valorMarcaRow = worksheet.getCell(letraF+(fc+3));
        valorMarcaRow.value = row["Talla"]
        valorMarcaRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        valorMarcaRow.alignment = { vertical: 'middle', horizontal: 'left' }
    
    
    
        
        let ColorRow = worksheet.getCell(letraI+(fc+4));
        ColorRow.value = "COLOR"
        ColorRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        ColorRow.alignment = { vertical: 'middle', horizontal: 'left' }
    
        ColorRow.border = {
          left: {style:'thin'}
        }
        let valorColorRow = worksheet.getCell(letraF+(fc+4));
        valorColorRow.value = row["Color"]
        valorColorRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        valorColorRow.alignment = { vertical: 'middle', horizontal: 'left' }
    
    
    
        
        let CantidadRow = worksheet.getCell(letraI+(fc+5));
        CantidadRow.value = "CANTIDAD"
        CantidadRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        CantidadRow.alignment = { vertical: 'middle', horizontal: 'left' }
        CantidadRow.border = {
          left: {style:'thin'}
        }
        let valorCantidadRow = worksheet.getCell(letraF+(fc+5));
        valorCantidadRow.value = row["Cantidad"]
        valorCantidadRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        valorCantidadRow.alignment = { vertical: 'middle', horizontal: 'right' }
    
    
        let EstadoRow = worksheet.getCell(letraI+(fc+6));
        EstadoRow.value = "ESTADO"
        EstadoRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        EstadoRow.alignment = { vertical: 'middle', horizontal: 'left' }
        EstadoRow.border = {
          left: {style:'thin'},
          bottom: {style:'thin'}
        }
        let valorEstadoRow = worksheet.getCell(letraF+(fc+6));
        valorEstadoRow.value = row["Estado"]
        valorEstadoRow.font = {
          name: 'Calibri',
          size: 9,   
          bold: true 
        }
        valorEstadoRow.alignment = { vertical: 'middle', horizontal: 'left' }
        valorEstadoRow.border = { 
          bottom: {style:'thin'}
        }
    
        
        let b1Row = worksheet.getCell(encabF+fc);
        b1Row.border = {
          right: {style:'thin'}
        }
        let b2Row = worksheet.getCell(encabF+(fc+1));
        b2Row.border = {
          right: {style:'thin'}
        }
        let b3Row = worksheet.getCell(encabF+(fc+2));
        b3Row.border = {
          right: {style:'thin'}
        }
        let b4Row = worksheet.getCell(encabF+(fc+3));
        b4Row.border = {
          right: {style:'thin'}
        }
        let b5Row = worksheet.getCell(encabF+(fc+4));
        b5Row.border = {
          right: {style:'thin'}
        }
        let b6bRow = worksheet.getCell(encabF+(fc+5));
        b6bRow.border = {
          right: {style:'thin'}
        }
        let b7dow = worksheet.getCell(encabF+(fc+6));
        b7dow.border = {
          right: {style:'thin'},
          bottom: {style:'thin'}
        }
        
        if(i==2){i=1}else{i++;}
        f++;
      }
     


    
  })

 
    worksheet.getColumn(1).width = 13;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 3;
    worksheet.getColumn(5).width = 13;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 20; 



    //worksheet.addRow([]);


    //Footer Row
    let footerRow = worksheet.addRow(['']);
    /*footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid'
    };

    footerRow.getCell(1).font = {      
      color: { argb: 'FFFFFF' },
      size: 12
    }*/

    //Merge Cells
    worksheet.mergeCells(`` + abcIni + `${footerRow.number}:` + abcFin + `${footerRow.number}`);





    ////////////////////////////////


    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, title + '.xlsx');
    })



  }

}
