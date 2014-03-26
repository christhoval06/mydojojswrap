/**
 * @author Cristobal Barba
 */

define(
    "dojo",
    "dijit/registry",
    "dojox/grid/DataGrid",
    "dojo/store/Memory",
    "dojo/data/ObjectStore",

    function (dojo, registry, EnhancedGrid) {

    }
);
require([
    "dojox/grid/DataGrid",
    "dojox/grid/cells",
    "dojox/grid/cells/dijit",
    "dojo/store/Memory",
    "dojo/data/ObjectStore",
    "dojo/date/locale",
    "dojo/currency",
    "dijit/form/DateTextBox",
    "dijit/form/CurrencyTextBox",
    "dijit/form/HorizontalSlider",
    "dojo/domReady!"
], function (DataGrid, cells, cellsDijit, Memory, ObjectStore, locale, currency, DateTextBox, CurrencyTextBox, HorizontalSlider) {
    var grid;

    function formatCurrency(inDatum) {
        return isNaN(inDatum) ? '...' : currency.format(inDatum, this.constraint);
    }

    function formatDate(inDatum) {
        return locale.format(new Date(inDatum), this.constraint);
    }

    gridLayout = [
        {
            defaultCell: { width: 8, editable: true, type: cells._Widget, styles: 'text-align: right;'  },
            cells: [
                { name: 'Id', field: 'id', editable: false /* Can't edit ID's of dojo/data items */ },
                { name: 'Date', field: 'col8', width: 10, editable: true,
                    widgetClass: DateTextBox,
                    formatter: formatDate,
                    constraint: {formatLength: 'long', selector: "date"}},
                { name: 'Priority', styles: 'text-align: center;', field: 'col1', width: 10,
                    type: cells.ComboBox,
                    options: ["normal", "note", "important"]},
                { name: 'Mark', field: 'col2', width: 5, styles: 'text-align: center;',
                    type: cells.CheckBox},
                { name: 'Status', field: 'col3',
                    styles: 'text-align: center;',
                    type: cells.Select,
                    options: ["new", "read", "replied"] },
                { name: 'Message', field: 'col4', styles: '', width: 10 },
                { name: 'Amount', field: 'col5', formatter: formatCurrency, constraint: {currency: 'EUR'},
                    widgetClass: CurrencyTextBox },
                { name: 'Amount', field: 'col5', formatter: formatCurrency, constraint: {currency: 'EUR'},
                    widgetClass: HorizontalSlider, width: 10}
            ]
        }
    ];

    var data = [
        { id: 0, col1: "normal", col2: false, col3: "new", col4: 'But are not followed by two hexadecimal', col5: 29.91, col6: 10, col7: false, col8: new Date() },
        { id: 1, col1: "important", col2: false, col3: "new", col4: 'Because a % sign always indicates', col5: 9.33, col6: -5, col7: false, col8: new Date() },
        { id: 2, col1: "important", col2: false, col3: "read", col4: 'Signs can be selectively', col5: 19.34, col6: 0, col7: true, col8: new Date() },
        { id: 3, col1: "note", col2: false, col3: "read", col4: 'However the reserved characters', col5: 15.63, col6: 0, col7: true, col8: new Date() },
        { id: 4, col1: "normal", col2: false, col3: "replied", col4: 'It is therefore necessary', col5: 24.22, col6: 5.50, col7: true, col8: new Date() },
        { id: 5, col1: "important", col2: false, col3: "replied", col4: 'To problems of corruption by', col5: 9.12, col6: -3, col7: true, col8: new Date() },
        { id: 6, col1: "note", col2: false, col3: "replied", col4: 'Which would simply be awkward in', col5: 12.15, col6: -4, col7: false, col8: new Date() }
    ];

    var objectStore = new Memory({data: data});

    // global var "test_store"
    test_store = new ObjectStore({objectStore: objectStore});

    //	create the grid.
    grid = new DataGrid({
        store: test_store,
        structure: gridLayout,
        escapeHTMLInData: false,
        "class": "grid"
    }, "grid");
    grid.startup();

});
