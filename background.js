(function() {
	// 클립보드 복사를 위한 eventListener 및 함수.
	var copyToClipboard = (function() {
		var clipboardText = "";

		document.addEventListener('copy', function(e) {
			var textToPutOnClipboard = "some text which should appear in clipboard";
			e.clipboardData.setData('text/plain', clipboardText);
			e.preventDefault();
		});

		var copyToClipboard = function copyToClipboard(text) {
			clipboardText = text;

			document.execCommand("copy");
		};

		return copyToClipboard;
	})();

	var log = function(msg) {
		var bkg = chrome.extension.getBackgroundPage();
		bkg.console.log(msg);
	};

	var copyNowTabUrlWithRegEx = function(regex) {
		chrome.tabs.getSelected(null, function(tab) {
			var tablinkUrl = tab.url;

			log(tablinkUrl);

			var doaminUrl = "";

			try {
				doaminUrl = tablinkUrl.match(regex)[0];
			} catch(e) {
				log(e);
			}

			log(doaminUrl);

			copyToClipboard(doaminUrl);
		});
	};

	var copyNowTabUrl = function() {
		var regex = /(?<=^(http|https):\/\/)[^/]*/;

		copyNowTabUrlWithRegEx(regex);
	};

	var timer = null;
	// 클릭 액션
	chrome.browserAction.onClicked.addListener(function() {
		chrome.browserAction.setBadgeText({
			text: "Done"
		});

		copyNowTabUrl();

		if(timer) clearTimeout(timer);

		setTimeout(function() {
			chrome.browserAction.setBadgeText({
				text: ""
			});
		}, 3000);
	});
})();
