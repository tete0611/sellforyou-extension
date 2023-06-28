async bulkTypeOne(user) {
    document.addEventListener("DOMNodeInserted", (e: any) => {
      try {
        if (e.target.getAttribute("class") === "m-feedback") {
          let products: any = document.querySelectorAll("#main > div:nth-child(3) > div.grid-left a");
          console.log("콘솔테스트", products);
          for (let i in products) {
            try {
              if (products[i].getAttribute("id").includes("J_Itemlist_PLink")) {
                console.log("콘솔테스트2", products[i]);

                let input: any = document.createElement("input");
                let picker: any = document.getElementById("sfyPicker");

                input.id = products[i].getAttribute("href");
                input.className = "SELLFORYOU-CHECKBOX";
                input.checked = picker?.value === "false" ? false : true;
                input.type = "checkbox";

                if (user.userInfo.collectCheckPosition === "L") {
                  input.setAttribute("style", "left: 0px !important");
                } else {
                  input.setAttribute("style", "right: 0px !important");
                }

                const root = products[i].parentNode.parentNode.parentNode.parentNode;
                const medal = root.getElementsByClassName("icon-service-jinpaimaijia");

                input.setAttribute("medal", medal.length);
                console.log("input", input);

                products[i].parentNode.insertBefore(input, products[i].nextSibling);
              }
            } catch (e) {
              continue;
            }
          }

          return;
          // } else if (e.target.getAttribute("class") === "Pagination--pgWrap--kfPsaVv") {
        } else {
          let products: any = document.querySelectorAll(
            "#root > div > div:nth-child(2) > div.PageContent--contentWrap--mep7AEm > div.LeftLay--leftWrap--xBQipVc a"
          );
          console.log("콘솔테스트", products);

          for (let i in products) {
            try {
              if (products[i].getAttribute("class").includes("Card--doubleCardWrapper")) {
                console.log("콘솔테스트2", products[i]);

                let input: any = document.createElement("input");
                let picker: any = document.getElementById("sfyPicker");

                input.id = products[i].getAttribute("href");
                input.className = "SELLFORYOU-CHECKBOX";
                input.checked = picker?.value === "false" ? false : true;
                input.type = "checkbox";

                if (user.userInfo.collectCheckPosition === "L") {
                  input.setAttribute("style", "left: 0px !important");
                } else {
                  input.setAttribute("style", "right: 0px !important");
                }

                //금메달 상품 리스트인데 해당 금메달 상품은 새로운페이지에는 표기되지 않아서 기존 코드로 보유
                //추후 표기되어있는게 있으면 확인 기존 페이지 없어질ㄸ ㅐ가정하여 test 폴더에 testone.html에 보관해두었음
                // const root = products[i].parentNode.parentNode.parentNode.parentNode;
                // const medal = root.getElementsByClassName("icon-service-jinpaimaijia");

                // input.setAttribute("medal", medal.length);
                console.log("input", input);
                e.target.appendChild(input);
                // products[i].parentNode.insertBefore(input, products[i].nextSibling);
              }
            } catch (e) {
              continue;
            }
          }
        }
      } catch (e) {
        //
      }
    });
  }