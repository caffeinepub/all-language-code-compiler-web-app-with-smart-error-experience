import OutCall "http-outcalls/outcall";
import List "mo:core/List";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";

actor {
  // Supported Languages and Their Identifiers
  type Language = {
    id : Text;
    compiler : Text;
    runtime : Text;
  };

  module Language {
    public func compare(lang1 : Language, lang2 : Language) : Order.Order {
      Text.compare(lang1.id, lang2.id);
    };
  };

  let supportedLanguages = List.empty<Language>();

  // Add supported languages to the list
  supportedLanguages.add({
    id = "motoko";
    compiler = "moc";
    runtime = "ic-cdk-runtime";
  });
  supportedLanguages.add({
    id = "rust";
    compiler = "rustc";
    runtime = "wasmtime";
  });

  // Compilation and Execution Result Type
  type CompilationResult = {
    stdout : Blob;
    stderr : Blob;
    status : Nat;
    diagnostics : ?Blob;
  };

  // Compare results by language id
  let supportedLanguagesArray = supportedLanguages.toArray().sort();

  // Persistent Configuration Fields (e.g., HTTP API credentials)
  var apiUrl = "https://core.runeseekr.org/exercise";
  type HttpMethod = { #get : (); #post : () };
  var apiKey : ?Text = null;

  func getLanguageById(id : Text) : ?Language {
    for (lang in supportedLanguages.values()) {
      if (lang.id == id) { return ?lang };
    };
    null;
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // (In a real system, use admin authentication to prevent unauthorized modifications)
  // Only accept bruce if testing locally
  public shared ({ caller }) func onlyBruce() : async () {
    let allowedPrincipal = "o6jdd-nyaaa-aaaaa-aaaia-cai";
    if (caller.toText() != allowedPrincipal) {
      Runtime.trap("You are not authorized to update service tokens.");
    };
  };

  public shared ({ caller }) func setupApiKey(key : Text) : async () {
    await onlyBruce();
    apiKey := ?key;
  };

  public shared ({ caller }) func setApiUrl(url : Text) : async () {
    await onlyBruce();
    apiUrl := url;
  };

  public query ({ caller }) func getApiUrl() : async Text {
    apiUrl;
  };

  public shared ({ caller }) func codeToServe() : async Text {
    let url = "http://fastapi:8000/echo";
    let headers = switch (apiKey) {
      case (null) {
        [{ name = "Accept"; value = "application/json" }, { name = "Content-Type"; value = "text/plain" }];
      };
      case (?key) {
        [
          { name = "Accept"; value = "application/json" },
          { name = "Content-Type"; value = "text/plain" },
          { name = "Authorization"; value = key },
        ];
      };
    };
    await OutCall.httpGetRequest(url, headers, transform);
  };
};
