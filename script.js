var clicked = false;
var flag = false;

function input(){
  var raw = $("#input").val();
  var target = $("#target").val();

  r = raw.replaceAll(/ً/g, "");
  r = r.replaceAll(/ٌ/g, "");
  r = r.replaceAll(/ٍ/g, "");
  r = r.replaceAll(/ّ/g, "");
  r = r.replaceAll(/َ/g, "");
　r = r.replaceAll(/ِ/g, "");
  r = r.replaceAll(/ُ/g, "");
  r = r.replaceAll(/ْ/g, "");

  r = r.replaceAll(/[^\u0621-\u064A]/g, " ");
  r = r.replaceAll(/[  ]/g, " ");
  r = r.replaceAll(/ـ/g, "");

  var line = r.replace(/\r?\n/g,"");
  var words = line.split(" ");

  var result = "";

  for(var i = 0; i < words.length; i++) {
    var word = split_letter_and_shakl(words[i]);
    //word[0] = word[0].replaceAll("^[\u0621-\u064A]", "");
    //word[0] = word[0].replace("^(أ|ب|ت|ث|ج|ح|خ|د|ذ|ر|ز|ط|ظ|س|ش|ص|ض|ع|غ|ف|ق|ك|ل|م|ن|ه|و|ي|ئ|ء|ؤ|ى|آ|)", "");
    result += "<span onclick=osareta(this);nekochan('" + word[0] + "')>" + words[i] + "</span> ";
  }

  $("#result").html(result);
  console.log(target);
  $.getJSON("https://script.google.com/macros/s/AKfycbxxNplJPPQF-FORifZrAsbQ_Ge3fIOOetemCqLwgyki8tIEK80/exec", { text : raw, target : target}).done(function(d, s, j){
    $("#translation").text(d["text"]);
  });
}

function osareta(e) {
  e.style.color = "blue";
}

function nekochan(w)
{
	if( clicked )
	{
		clicked = false;

    //vSearchする
    var url = "http://www.linca.info/alladinPlus/vSearch.php?bk=0&lg=1&md=1&sw=" + encodeURI(w);
    window.open(url, "A");

    flag = true;

		return;
	}

	clicked = true;
	setTimeout( function()
	{
		if( clicked && !flag)
		{
			clicked = false;

      //nSearchする
      var url = "http://www.linca.info/alladinPlus/nSearch.php?sw=" + encodeURI(w) + "&bk=0&lg=1&md=1";
      window.open(url, "A");

		}
		clicked = false;
    flag = false;
	} , 500 );
}

/*
  split_letter_and_shakl() : a function that is used to split an arabic word to its letters and shakls
  returns: array {a list of letters, a list of shakls}
------------------------------------------------------------------------------*/
function split_letter_and_shakl(str) {
  var letters = "";
  var shakls = [];

  var row = str.split("");

  var flg = false;
  var offset = 0;

  for(let i = 0; i < row.length; i++) {
    if(isDialectical(row[i].charCodeAt(0))) {
      if(flg) {
        offset++;

        shakls[i - offset].add(row[i]);
      } else {
        shakls[i - offset] = new Set(row[i]);
      }

      flg = true;
    } else {
      if(!flg) {
        shakls[i - offset] = new Set();

        offset--;
      }

      letters += row[i];
      shakls[i - offset] = new Set();

      flg = false;
    }
  }

  if(!flg) shakls[shakls.length] = new Set();

  return [letters, shakls];
}

/*
  isDialectical(): a function that is used to decide whether a given charcode
  is one of the dialectical marks
------------------------------------------------------------------------------*/
function isDialectical(charcode) {
  if(charcode >= 0x064B && charcode <= 0x0653)
  {
    return true;
  }

  if(charcode == 0x0670 || charcode == 0x06E4) {
    return true;
  }
}
