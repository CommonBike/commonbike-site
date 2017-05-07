#include <ESP8266WiFi.h>
// #include <WiFiClientSecure.h>
#include <ArduinoJson.h>

// this sketch has been written for the NODEMCU V1.0 (ESP8266) Module
// it uses modules from the dealextream/aliexpress 37-in-1 sensor kit 
// documentation: https://tkkrlab.nl/wiki/Arduino_37_sensors

// PINOUT: 

//switch module gnd - NODEMCU gnd
//switch module Signal - NODEMCU D1
//switch module +V (middle pin) - NODEMCU +3.3V
//
//RGB module gnd - NODEMCU gnd 
//RGB module R - 220R - NODEMCU D6
//RGB module G - 220R - NODEMCU D7

// usage

// 1. enter wifi network credentials below
//
const char* ssid = "xanadu";
// const char* ssid = "Delhi";  
const char* password = "hondenkop77##";

// 2. create an API key in the commonbike GUI for the object that you want to rent
// - You must be manager for the location that the object belongs to
// - go to the corresponding location (Mijn locaties -> select location -> click info)
// - go to the object (select object, click info)
// - create an API key
//
// enter the API key below

const char* api_key = "8c9ee150814ab93892196fa00bc55719";

// commonbike server info
const unsigned long HTTP_TIMEOUT = 5000;  // max respone time from server
const char* commonbikeServer = "develop.common.bike";
const int commonbikeServerHttpPort = 80;
const int commonbikeServerHttpsPort = 443;

// Todo: make HTTPS version
//const int usesecure = false;

//// Use web browser to view and copy
//// SHA1 fingerprint of the certificate
//const char* fingerprint = "CF 05 98 89 CA FF 8E D8 5E 5C E0 C2 E4 F7 E6 C3 C7 50 DD 5C";

const int SWITCH = D1;
const int LED_RED = D6;
const int LED_GREEN = D7;
const int LED_BLUE = D8;

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

  set_state_alloff();
    
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);  
  delay(100);                       // wait for a second
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)

  Serial.begin(115200);
  Serial.println();

  listNetworks();

  Serial.print("connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1);
    set_state_flash_next();
  }
  set_state_alloff();
  
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

  attachInterrupt(SWITCH, toggle_state, FALLING);  
}

String next_command = "";

void toggle_state() {
  Serial.println("request toggle state!");
  next_command = "rent_toggle";
}

String pollLockerState(String action) {
  WiFiClient client;
  if (!client.connect(commonbikeServer, commonbikeServerHttpPort)) {
    Serial.println("connection failed");
    return "error";
  }
  
  String url = "/api/locker/v1/";
  url += "?api_key=";
  url += api_key;

  if(action=="rent_toggle"||action=="rent_start"||action=="rent_end") {
    url+= "&action=";
    url+= action;
  }
  
  Serial.print("Requesting URL: ");
  Serial.println(url);
  
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + commonbikeServer + "\r\n" + 
               "Connection: close\r\n\r\n");
  unsigned long timeout = millis();
  char endOfHeaders[] = "\r\n\r\n";

  client.setTimeout(HTTP_TIMEOUT);
  bool ok = client.find(endOfHeaders);
  if (!ok) {
    Serial.println("No response or invalid response!");
    return "error";
  }
  
  // Read all the lines of the reply from server and print them to Serial
  String result = "";
  while(client.available()){
    result += client.readStringUntil('\r\n');
  }

  int jsonstart = result.indexOf('{');
  int jsonend = result.lastIndexOf('}');

  if(jsonstart>=0&&jsonend>=0) {
    result = result.substring(jsonstart,jsonend+1);
    
//    Serial.print("Received result:\r");
//    Serial.println(result+'\r');
  } else {
    Serial.println("Invalid response!");
    return "error";
  }

  StaticJsonBuffer<500> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(result);
  if (!root.success()) {
    Serial.println("JSON parsing failed!");
    return "error";
  }

  //{
  //  "title": "Bikelocker C", 
  //  "state": "inuse"
  //}

  client.stop();

  if(root["state"]=="available") {
    return "available";
  } else {
    return "notavailable";
  }
}

int flash_value = 0;

void set_state_available() {
  analogWrite (LED_RED, 0);
  analogWrite (LED_BLUE, 0);
  analogWrite (LED_GREEN, 255);
}

void set_state_inuse_local() {
  analogWrite (LED_RED, 0);
  analogWrite (LED_BLUE, 255);
  analogWrite (LED_GREEN, 0);
}

void set_state_inuse_commonbike() {
  analogWrite (LED_RED, 255);
  analogWrite (LED_BLUE, 0);
  analogWrite (LED_GREEN, 0);
}

void set_state_alloff() {
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

void loop() {
  delay(2000);

  // digitalWrite(LED_BUILTIN, LOW);   // turn the LED on (HIGH is the voltage level)

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("ALERT: wifi disconnected!");
    digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
    set_state_alloff();
    return;
  }
  
  Serial.print("connecting to ");
  Serial.println(commonbikeServer);

  String lockerState = pollLockerState(next_command);
  next_command = "";
  
  Serial.print("poll return value ");
  Serial.println(lockerState);
  if(lockerState=="available") {
    set_state_available();
    Serial.println("locker is available");
  } else if (lockerState=="notavailable") {
    set_state_inuse_commonbike();
    Serial.println("locker is not available");
    // digitalWrite(LED_BUILTIN, LOW);   // turn the LED on (HIGH is the voltage level)
  } else if (lockerState=="error") {
    set_state_alloff();
    Serial.println("unable to read locker state");
  } else {
    set_state_alloff();
    Serial.println("unknown locker state");
  }
}

