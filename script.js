/**
 *
 * @param {HTMLTableElement} table
 * @param {number} columnIndex
 * @param {boolean} asc
 */

const DOMEvents = {
  CLICK: "click",
  //...
}

const CustomErrorBaseMessage = {
  PARAM_FUNCTION_NEEDED: "Function needed, but got",
};

const JSTypes = Object.freeze({
  UNDEFINED: "undefined",
  FUNCTION: "function",
  OBJECT: "object",
  //...
});

const SortingOrders = Object.freeze({
  NEUTRAL: "neutral",
  ASC: "asc",
  DESC: "desc",
});

const THeadColumnSortingClasses = Object.freeze({
  [SortingOrders.NEUTRAL]: "thead-neutral",
  [SortingOrders.ASC]: "thead-asc",
  [SortingOrders.DESC]: "thead-desc",
});

const getCurrentAndNextSortingOrder = (tHeadColumn) => {

  const entries = Object.entries(
    THeadColumnSortingClasses
  );

  const [currentSortingOrder, _currentSortingClassName] = entries.find(([_sortingOrder, sortingClassName]) => {
    const r = tHeadColumn.classList.contains(sortingClassName);
    console.log("predicate => ", r)
    return r === true

  }
    // console.log(_sortingOrder)
  );

  if(!currentSortingOrder) 
    return [SortingOrders.NEUTRAL, SortingOrders.ASC];

  const sortingOrderValues = Object.values(SortingOrders);

  const currentSortingOrderIndex =
    sortingOrderValues.indexOf(currentSortingOrder);

  if (currentSortingOrderIndex < 0) return;

  const nextSortingOrderIndex =
    (currentSortingOrderIndex + 1) % sortingOrderValues.length;

  return [currentSortingOrder, sortingOrderValues[nextSortingOrderIndex]];
};

const defaultComparator = (a, b) => {
  return String(a).localeCompare(String(b), undefined, { numeric: true });
};

const compare = (a, b, comparator = defaultComparator, asc) => {
  if (!comparator) return;

  if (typeof comparator !== JSTypes.FUNCTION)
    return TypeError(
      `${CustomErrorBaseMessage.PARAM_FUNCTION_NEEDED} ${comparator}!`
    );

  return (asc === true || -1) * comparator(a, b);
};

const handleTHeadColumnClick = (event, tHeadColumnElement) => {
  const [currentSortingOrder, nextSortingOrder] =
    getCurrentAndNextSortingOrder(tHeadColumnElement);

  if(!nextSortingOrder) return;

  if (
    tHeadColumnElement.classList.replace(
      THeadColumnSortingClasses[currentSortingOrder],
      THeadColumnSortingClasses[nextSortingOrder]
    )
  );
  else
    tHeadColumnElement.classList.add(
      THeadColumnSortingClasses[nextSortingOrder]
    );
};

function sortTableByColumn(table, columnIndex, asc = true) {
  const tHead = table.tHead;
  const tBody = table.tBodies[0];

  const tHeadRows = Array.from(tHead.children);
  const tBodyRows = Array.from(tBody.children);

  console.log("tbody => ", tBody);
  console.log("thead => ", tHead);

  console.log("tBodyRows => ", tBodyRows);
  console.log("tHeadRows => ", tHeadRows);

  // Move this statement from the current function
  // Array.from(tHeadRows[0].children).forEach((tHeadColumn) => {
  //   console.log("tHeadColumn, => ", tHeadColumn);
  //   tHeadColumn.addEventListener(DOMEvents.CLICK, (event) => handleTHeadColumnClick(event, tHeadColumn));
  // });

  tBodyRows.sort((row1, row2) => {
    const content1 = row1.children[columnIndex].textContent;

    const content2 = row2.children[columnIndex].textContent;

    const sortingIndicator = compare(content1, content2, asc);

    console.log(content1, content2, sortingIndicator);
    return sortingIndicator;
  });

  // Supprimer les élements existants dans le tBody

  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Maintenant changer la classe du thead par lequel le tableau a été sorter

  console.log("ok");

  console.log("Sorted tBodyRows", tBodyRows);
  tBody.append(...tBodyRows);
}

const table = document.querySelector("#table");

Array.from(table.tHead.children[0].children).forEach((tHeadColumn) => {
  console.log("tHeadColumn, => ", tHeadColumn);
  tHeadColumn.addEventListener(DOMEvents.CLICK, (event) => handleTHeadColumnClick(event, tHeadColumn));
});

console.log("table => ", table);

const r = sortTableByColumn(table, 1, false);

console.log("r => ", r);
