var name_ = "contacto";
var labels_ = ['date','mail','nombre','departamento','mensaje','test'];

var util_test_              = lib.util_test;
var util_response_          = lib.util_response;
var util_responseArray_     = lib.util_responseArray;
var util_txtRamdom_         = lib.util_txtRamdom;
var util_codeVideo_         = lib.util_codeVideo;
var util_formatDateISO_     = lib.util_formatDateISO;
var util_unique_            = lib.util_unique;
var util_sumaID_            = lib.util_sumaID;
var util_onlyData_          = lib.util_onlyData;
var util_indexOf_           = lib.util_indexOf;
var util_restaHora_         = lib.util_restaHora;
var util_simplificarCadena_ = lib.util_simplificarCadena;
var util_incrementable_     = lib.util_incrementable;
var util_sort_              = lib.util_sort;
var util_parseUrl_          = lib.util_parseUrl;
var util_getWeek_           = lib.util_getWeek;
var util_getdata_           = lib.util_getdata;
var util_markTest_          = lib.util_markTest;
var util_testErrores_       = lib.util_testErrores;
var util_parseDate_         = lib.util_parseDate;
var util_appendRow_         = lib.util_appendRow;
var util_addContact_        = lib.util_addContact;
var patron_http_            = lib.patron_http;
var date_today_             = lib.date_today;
var date_weekno_            = lib.date_weekno;
var date_year_              = lib.date_year;
var date_beforeLastWeek_    = lib.date_beforeLastWeek;
var date_lastWeek_          = lib.date_lastWeek;
var date_yesterday_         = lib.date_yesterday;
var json_creaFile_          = lib.json_creaFile;
var mail_                   = Session.getActiveUser().getEmail();
var nombre                  = "NOMBRE";

function recepcion(){
  var lock = LockService.getUserLock();
  lock.waitLock(10000);
  
  var ldata = util_getdata_(SpreadsheetApp.openById(idss).getSheetByName(name_));
  for (var i = 0; i < ldata.length; i++){
    if(!ldata[i].test){
      var date = ldata[i].date;
      var name = ldata[i].nombre;
      var departamento = ldata[i].departamento;
      var mensaje = ldata[i].mensaje;
      var email = ldata[i].email;
      var emailReenvio = util_response_(util_getdata_(ssMails()),'departamento',departamento,'mail');
      
      if(!emailReenvio) return;
      
      var subject = "Contacto de "+ nombre +" para "+ departamento;
      var html_notifi = "<html><body>";
      html_notifi += '<p><b>Nombre:</b> '+name+'</p>';
      html_notifi += '<p><b>Mail:</b> '+email+'</p>';
      html_notifi += '<p><b>Mensaje:</b> '+mensaje+'</p>';
      html_notifi += '</body></html>';
      MailApp.sendEmail({to:emailReenvio,subject: subject,htmlBody:html_notifi});
      
      var html_contest = '<html><body>';
      html_contest += "<p>Hemos recibido tu mensaje y haremos lo posible para contestarte cuanto antes.</p>";
      html_contest += "<p>Un saludo.</p>";
      html_contest += "</body></html>";
      MailApp.sendEmail({to:email,subject: subject,htmlBody:html_contest}); 
      
      util_markTest_(ldata[i].date.toString(),ldata,"x",'test',ss);
      break
    }
  }
  lock.releaseLock();
}

var scriptProperties = PropertiesService.getScriptProperties();

function creaSpreadsheet(){

  var idss = SpreadsheetApp.create(name_).getId();
  scriptProperties.setProperty('idss', idss);
  
  var idform = FormApp.create(name_).getId();
  scriptProperties.setProperty('idform', idform);
  
  var form = FormApp.openById(idform);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, idss);
  var ss = SpreadsheetApp.openById(idss);
  ss.getSheets()[0].setName(name_);
  ScriptApp.newTrigger('recepcion').forForm(form).onFormSubmit().create();
  
  for(var i = 1; i != labels_.length;i++){form.addTextItem().setTitle(labels_[i])}
  
  ss.getSheetByName(name_).getRange('A1').setValue('date');
}
