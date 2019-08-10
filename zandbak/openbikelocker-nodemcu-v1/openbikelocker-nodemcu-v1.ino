#include <ESP8266WiFi.h>
// #include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "settings.h"

// this sketch has been written for the NODEMCU V1.0 (ESP8266) Module
// it uses modules from the dealextream/aliexpress 37-in-1 sensor kit 
// documentation: https://tkkrlab.nl/wiki/Arduino_37_sensors
//
// Requires arduinoJSON library!
//
// usage
//
// copy settings_demo.h to settings.h and fill in the network info and commonbike API Key

// PINOUT: 

//switch module gnd - NODEMCU gnd
//switch module Signal - NODEMCU D1
//switch module +V (middle pin) - NODEMCU +3.3V
//
//RGB module gnd - NODEMCU gnd 
//RGB module R - 220R - NODEMCU D6
//RGB module G - 220R - NODEMCU D7

const unsigned long STATE_AVAILABLE = 0;
const unsigned long STATE_INUSE = 1;  
const unsigned long STATE_OUTOFORDER = 2;

int _lockerstate = STATE_AVAILABLE; // default state when turned on

String lastcardhash = "";

volatile unsigned long next_poll_millis = 0;

// commonbike server info
const unsigned long HTTP_TIMEOUT = 5000;  // max respone time from server
const char* commonbikeServer = "develop.common.bike";
const int commonbikeServerHttpPort = 80;
//const char* commonbikeServer = "192.168.150.105";
//const int commonbikeServerHttpPort = 3000;
const int commonbikeServerHttpsPort = 443;

// Todo: make HTTPS version
//const int usesecure = false;

//// Use web browser to view and copy
//// SHA1 fingerprint of the certificate
//const char* fingerprint = "CF 05 98 89 CA FF 8E D8 5E 5C E0 C2 E4 F7 E6 C3 C7 50 DD 5C";

const int SWITCH = D5;
const int LED_RED = D1;
const int LED_GREEN = D2;
const int LED_BLUE = D4;

//const int SIM900_TXD = D7;
//const int SIM900_RXD = D8;

void printEncryptionType(int thisType) {
  // read the encryption type and print out the name:
  switch (thisType) {
    case ENC_TYPE_WEP:
      Serial.println("WEP");
      break;
    case ENC_TYPE_TKIP:
      Serial.println("WPA");
      break;
    case ENC_TYPE_CCMP:
      Serial.println("WPA2");
      break;
    case ENC_TYPE_NONE:
      Serial.println("None");
      break;
    case ENC_TYPE_AUTO:
      Serial.println("Auto");
      break;
    default:
      Serial.println(thisType);
      break;
  }
}

void listNetworks() {
  // scan for nearby networks:
  Serial.println("** Scan Networks **");
  int numSsid = WiFi.scanNetworks();
  if (numSsid == -1) {
    Serial.println("Couldn't get a wifi connection");
    while (true);
  }

  // print the list of networks seen:
  Serial.print("number of available networks:");
  Serial.println(numSsid);

  // print the network number and name for each network found:
  for (int thisNet = 0; thisNet < numSsid; thisNet++) {
    Serial.print(thisNet);
    Serial.print(") ");
    Serial.print(WiFi.SSID(thisNet));
    Serial.print("\tSignal: ");
    Serial.print(WiFi.RSSI(thisNet));
    Serial.print(" dBm");
    Serial.print("\tEncryption: ");
    printEncryptionType(WiFi.encryptionType(thisNet));
  }
}

void setup() {
  pinMode(LED_RED, OUTPUT);  
  pinMode(LED_GREEN, OUTPUT);  
  pinMode(LED_BLUE, OUTPUT);  
  pinMode(SWITCH, INPUT_PULLUP);  

  set_leds_off();
    
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);  
  delay(100);                       // wait for a second
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)

  Serial.begin(115200);
  Serial.println();

  // listNetworks();

  Serial.print("connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1);
    set_state_flash_next();
  }
  set_leds_off();
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  digitalWrite(LED_BUILTIN, HIGH);    // turn the LED off by making the voltage LOW
  
//  if(usesecure) {
//    // Use WiFiClientSecure class to create TLS connection
//    WiFiClientSecure client;
//    Serial.print("connecting to ");
//    Serial.println(commonbikeServer);
//    if (!client.connect(commonbikeServer, commonbikeServerHttpsPort)) {
//      Serial.println("connection failed");
//      return;
//    }
//  
//    if (client.verify(fingerprint, commonbikeServer)) {
//      Serial.println("certificate matches");
//    } else {
//      Serial.println("certificate doesn't match");
//    }
  
//    String url = "/repos/esp8266/Arduino/commits/master/status";
//    Serial.print("requesting URL: ");
//    Serial.println(url);
//  
//    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
//                 "Host: " + commonbikeServer + "\r\n" +
//                 "User-Agent: BuildFailureDetectorESP8266\r\n" +
//                 "Connection: close\r\n\r\n");
//  
//    Serial.println("request sent");
//    while (client.connected()) {
//      String line = client.readStringUntil('\n');
//      if (line == "\r") {
//        Serial.println("headers received");
//        break;
//      }
//    }
//    String line = client.readStringUntil('\n');
//    if (line.startsWith("{\"state\":\"success\"")) {
//      Serial.println("esp8266/Arduino CI successfull!");
//    } else {
//      Serial.println("esp8266/Arduino CI has failed");
//    }
//    Serial.println("reply was:");
//    Serial.println("==========");
//    Serial.println(line);
//    Serial.println("==========");
//    Serial.println("closing connection");
//  } else {
//    
//  }

  set_state_available();
  
  attachInterrupt(SWITCH, buttonpressed_handler, FALLING);  
}

String pollCommonbikeStatus(String action) { 
  WiFiClient cbClient;
  if (!cbClient.connect(commonbikeServer, commonbikeServerHttpPort)) {
    Serial.println("connection to commonbike server failed");
    return "error";
  }

  String url = "/api/locker/v1/";
  url += "?api_key=";
  url += api_key;

  if(action=="available"||action=="inuse"||action=="outoforder") {
    url+= "&action=";
    url+= action;

    url+= "&pincode=";
    if(action=="inuse") {
      url+= String(random(100000, 999999));
    } 

    url+= "&cardhash=";
    if(action=="inuse"&&lastcardhash=="") {
      // simulate card used at locker
      lastcardhash="100000" + String(random(100000, 999999));
    }
    url+=lastcardhash;
    
    url+= "&timestamp=20160905101112";
  }
  
  Serial.print(commonbikeServer);
  Serial.print(":");
  Serial.print(commonbikeServerHttpPort);
  Serial.print(url);
  Serial.print(" -> ");
  
  cbClient.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + commonbikeServer + "\r\n" + 
               "Connection: close\r\n\r\n");
  unsigned long timeout = millis();
  char endOfHeaders[] = "\r\n\r\n";

  cbClient.setTimeout(HTTP_TIMEOUT);
  bool ok = cbClient.find(endOfHeaders);
  if (!ok) {
    Serial.println("No response or invalid response!");
    return "error";
  }
  
  // Read all the lines of the reply from server and print them to Serial
  String result = "";
  while(cbClient.available()){
    result += cbClient.readStringUntil('\r\n');
  }

  Serial.println(result);

  int jsonstart = result.indexOf('{');
  int jsonend = result.lastIndexOf('}');

  if(jsonstart>=0&&jsonend>=0) {
    result = result.substring(jsonstart,jsonend+1);
  } else {
    Serial.println("Invalid response!");
    return "error";
  }

  cbClient.stop();

  StaticJsonBuffer<2000> jsonBuffer;

  // Serial.println(result);

  JsonObject& root = jsonBuffer.parseObject(result);
  if (!root.success()) {
    Serial.println("JSON parsing failed!");
    return "error";
  }

  //{
  //  "state": "available",
  //  "timestamp": 1494417623786,
  //  "username": ""
  //}
  if(root.containsKey("state")) {
    if(root["state"]=="available"||root["state"]=="inuse"||root["state"]=="outoforder"||
       root["state"]=="r_rentstart"||root["state"]=="r_opendoor"||root["state"]=="r_outoforder"||root["state"]=="r_available")  {
      Serial.println((const char *) root["state"]);

      if(root["state"]=="r_rentstart"&&root.containsKey("cardhash")) {
        Serial.print("received cardhash:");
        Serial.println((const char *) root["cardhash"]);
        lastcardhash=(const char*) root["cardhash"];
//        lastcardhash="";
      } else {
        lastcardhash="";
      }
      
      return root["state"];
    }
  } else if(root.containsKey("error")) {
      Serial.print("Error: ");
      return "error";
  }
  
  Serial.println("error");
  return "error";
}

int flash_value = 0;

void set_state_available() {
  Serial.println("this locker is now available");
  _lockerstate=STATE_AVAILABLE;  
  
  next_poll_millis = (long)(millis()) - 1;

  analogWrite (LED_RED, 0);
  analogWrite (LED_BLUE, 0);
  analogWrite (LED_GREEN, 255);
}

void set_state_inuse() {
  Serial.println("this locker is now rented out");
  _lockerstate=STATE_INUSE;

  next_poll_millis = (long)(millis()) - 1;

  analogWrite (LED_RED, 0);
  analogWrite (LED_BLUE, 255);
  analogWrite (LED_GREEN, 0);
}

void set_state_outoforder() {
  Serial.println("this locker is now out of order");
  _lockerstate=STATE_OUTOFORDER;

  next_poll_millis = (long)(millis()) - 1;

  analogWrite (LED_RED, 255);
  analogWrite (LED_BLUE, 0);
  analogWrite (LED_GREEN, 0);
}

void set_leds_off() {
  analogWrite (LED_RED, 0);
  analogWrite (LED_BLUE, 0);
  analogWrite (LED_GREEN, 0);
}

void set_state_flash_next() {
  analogWrite (LED_RED, flash_value);
  analogWrite (LED_BLUE, 255 - flash_value);
  analogWrite (LED_GREEN, 0);

  if(flash_value==255) {
    flash_value=0;
  } else {
    flash_value=flash_value+1;
  }
}

long debouncing_time = 500; //Debouncing Time in Milliseconds
volatile unsigned long last_micros;

void buttonpressed_handler() {
  if((long)(micros() - last_micros) >= debouncing_time * 1000) {
    if(_lockerstate!=STATE_OUTOFORDER) {
      if(_lockerstate==STATE_INUSE) {
        set_state_available();
      } else if (_lockerstate==STATE_AVAILABLE) {
        set_state_inuse();
      }
    } else {
       // ignore
    }

    last_micros = micros();
  }
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("ALERT: wifi disconnected!");
    digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
    set_leds_off();
    return;
  }

  if((long) millis() > next_poll_millis) {
   do_cycle();
   next_poll_millis = (long)(millis()) + 5000;
  }
  
  delay(250);
}

void do_cycle() {
  // first get current commonbike status
  
  String commonbikeStatus = pollCommonbikeStatus("");

  // check if there are requests
  if(commonbikeStatus.compareTo("r_rentstart")==0) {
    Serial.println("commonbike request to change state to " + commonbikeStatus);
    set_state_inuse();
  } else if(commonbikeStatus.compareTo("r_available")==0) {
    Serial.println("commonbike request to change state to" + commonbikeStatus);
    set_state_available();
  } else if(commonbikeStatus.compareTo("r_outoforder")==0) {
    Serial.println("commonbike request to change state to" + commonbikeStatus);
    set_state_outoforder();
  } else if (commonbikeStatus.compareTo("error")==0) {
    Serial.println("commonbike request to change state to" + commonbikeStatus);
    set_leds_off();
    Serial.println("unable to read locker state");
  }

  // check if the current state is in sync with commonbike, otherwise 
  // instruct commonbike to adjust status
  if(_lockerstate==STATE_AVAILABLE&&commonbikeStatus.compareTo("available")!=0) {
//    Serial.println("Set commonbike to available");
    pollCommonbikeStatus("available");
  } else if(_lockerstate==STATE_INUSE&&commonbikeStatus.compareTo("inuse")!=0) {
//    Serial.println("Set commonbike to inuse");
    pollCommonbikeStatus("inuse");
  } else if(_lockerstate==STATE_OUTOFORDER&&commonbikeStatus.compareTo("outoforder")!=0) {
//    Serial.println("Set commonbike to outooforder");
    pollCommonbikeStatus("outoforder");
  }  
}

