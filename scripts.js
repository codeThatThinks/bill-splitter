// used for unique ids
var receipt_count = 0;
var person_count = 0;
var item_count = 0;

function Receipt(name, tax)
{
    receipt_count++;
    this.id = receipt_count;

    this.name = name;
    this.items = new Array();
    this.tax = tax;
    this.tax_rate = 0;
    this.total = 0;
}

function Item(name, price, taxed)
{
    item_count++;
    this.id = item_count;

    this.name = name;
    this.price = price;
    this.taxed = taxed;
}

function Person(name)
{
    person_count++;
    this.id = person_count;

    this.name = name;
    this.opt_outs = new Array();
    this.total = 0;
}

var receipts = new Array();
var people = new Array();

function add_person(e)
{
    e.preventDefault();

    $('#table .person-add-name').hide();
    $('#table .person-add-name input').off("focusout");
    $('#table .person-add-name').off("submit");
    $('#table .person-add').show();

    if($('#table .person-add-name input').val() != '')
    {
        people.push(new Person($('#table .person-add-name input').val()));
        update_table();
    }
}

function delete_person(e)
{
    e.preventDefault();

    var id = $(this).parent().attr('class').match(/\d+/g)[0];

    for(var i = 0; i < people.length; i++)
    {
        if(people[i].id == id) people.splice(i, 1);

    }

    update_table();
}

function add_receipt(e)
{
    e.preventDefault();

    $('#table .receipt-add-name').hide();
    $('#table .receipt-add-name input').off("focusout");
    $('#table .receipt-add-name').off("submit");
    $('#table .receipt-add').show();

    if($('#table .receipt-add-name input').val() != '')
    {
        var r = new Receipt($('#table .receipt-add-name input').val(), 0);
        r.items.push(new Item('', 0, false));
        receipts.push(r);
        update_table();
    }
}

function delete_receipt(e)
{
    e.preventDefault();

    var id = $(this).parent().parent().attr('class').match(/\d+/g)[0];
    for(var i = 0; i < receipts.length; i++)
    {
        if(receipts[i].id == id) var index = i;
    }

    // remove items in this receipt from opt_outs
    for(var i = 0; i < people.length; i++)
    {
        for(var j = 0; j < receipts[index].items.length; j++)
        {
            if(people[i].opt_outs.indexOf(receipts[index].items[j]) != -1)
            {
                people[i].opt_outs.splice(people[i].opt_outs.indexOf(receipts[index].items[j]), 1);
            }
        }
    }

    // remove from receipts array
    for(var i = 0; i < receipts.length; i++)
    {
        if(receipts[i].id == id) receipts.splice(i, 1);
    }

    update_table();
}

function update_receipt_tax(e)
{
    e.preventDefault();

    if(!Number.isNaN(parseFloat($(this).val().valueOf())))
    {
        var id = $(this).parent().parent().parent().attr('class').match(/\d+/g)[0];

        for(var i = 0; i < receipts.length; i++)
        {
            if(receipts[i].id == id)
            {
                receipts[i].tax = parseFloat($(this).val());
            }
        }
    }

    update_table();
}

function add_item(e)
{
    e.preventDefault();

    var id = $(this).parent().parent().parent().attr('class').match(/\d+/g)[0];

    for(var i = 0; i < receipts.length; i++)
    {
        if(receipts[i].id == id)
        {
            receipts[i].items.push(new Item('', 0, false));
        }
    }

    update_table();
}

function delete_item(e)
{
    e.preventDefault();

    var receipt_id = $(this).parent().parent().attr('class').match(/receipt-\d+/g)[0].match(/\d+/g)[0];
    var item_id = $(this).parent().parent().attr('class').match(/item-\d+/g)[0].match(/\d+/g)[0];

    // remove item from opt_outs
    for(var i = 0; i < people.length; i++)
    {
        for(var j = 0; j < people[i].opt_outs.length; j++)
        {
            if(people[i].opt_outs[j].id == item_id) people[i].opt_outs.splice(j, 1);
        }
    }

    // remove item from receipt's items array
    for(var i = 0; i < receipts.length; i++)
    {
        if(receipts[i].id == receipt_id)
        {
            for(var j = 0; j < receipts[i].items.length; j++)
            {
                if(receipts[i].items[j].id == item_id) receipts[i].items.splice(j, 1);
            }
        }
    }

    update_table();
}

function toggle_item_taxed(e)
{
    e.preventDefault();

    var receipt_id = $(this).parent().parent().attr('class').match(/receipt-\d+/g)[0].match(/\d+/g)[0];
    var item_id = $(this).parent().parent().attr('class').match(/item-\d+/g)[0].match(/\d+/g)[0];

    for(var i = 0; i < receipts.length; i++)
    {
        if(receipts[i].id == receipt_id)
        {
            for(var j = 0; j < receipts[i].items.length; j++)
            {
                if(receipts[i].items[j].id == item_id)
                {
                    receipts[i].items[j].taxed = !receipts[i].items[j].taxed;
                }
            }
        }
    }

    update_table();
}

function toggle_item_opt_out(e)
{
    e.preventDefault();

    var receipt_id = $(this).parent().parent().attr('class').match(/receipt-\d+/g)[0].match(/\d+/g)[0];
    var item_id = $(this).parent().parent().attr('class').match(/item-\d+/g)[0].match(/\d+/g)[0];
    var person_id = $(this).parent().attr('class').match(/\d+/g)[0];

    if($(this).is(":checked"))
    {
        // remove opt-out
        for(var i = 0; i < people.length; i++)
        {
            if(people[i].id == person_id)
            {
                for(var j = 0; j < people[i].opt_outs.length; j++)
                {
                    if(people[i].opt_outs[j].id == item_id)
                    {
                        people[i].opt_outs.splice(j, 1);
                    }
                }
            }
        }
    }
    else
    {
        // opt-out of item
        for(var i = 0; i < receipts.length; i++)
        {
            if(receipts[i].id == receipt_id)
            {
                for(var j = 0; j < receipts[i].items.length; j++)
                {
                    if(receipts[i].items[j].id == item_id)
                    {
                        for(var k = 0; k < people.length; k++)
                        {
                            if(people[k].id == person_id)
                            {
                                people[k].opt_outs.push(receipts[i].items[j]);
                            }
                        }
                    }
                }
            }
        }
    }

    update_table();
}

function update_item_name(e)
{
    e.preventDefault();

    var receipt_id = $(this).parent().parent().parent().attr('class').match(/receipt-\d+/g)[0].match(/\d+/g)[0];
    var item_id = $(this).parent().parent().parent().attr('class').match(/item-\d+/g)[0].match(/\d+/g)[0];

    for(var i = 0; i < receipts.length; i++)
    {
        if(receipts[i].id == receipt_id)
        {
            for(var j = 0; j < receipts[i].items.length; j++)
            {
                if(receipts[i].items[j].id == item_id)
                {
                    receipts[i].items[j].name = $(this).val();
                }
            }
        }
    }

   update_table();
}

function update_item_price(e)
{
    e.preventDefault();

    if(!Number.isNaN(parseFloat($(this).val().valueOf())))
    {
        var receipt_id = $(this).parent().parent().parent().attr('class').match(/receipt-\d+/g)[0].match(/\d+/g)[0];
        var item_id = $(this).parent().parent().parent().attr('class').match(/item-\d+/g)[0].match(/\d+/g)[0];

        for(var i = 0; i < receipts.length; i++)
        {
            if(receipts[i].id == receipt_id)
            {
                for(var j = 0; j < receipts[i].items.length; j++)
                {
                    if(receipts[i].items[j].id == item_id)
                    {
                        receipts[i].items[j].price = parseFloat($(this).val());
                    }
                }
            }
        }
    }

    update_table();
}

function calc_totals(person)
{
    // determine tax rate for each receipt
    for(var i = 0; i < receipts.length; i++)
    {
        var taxed_amount = 0;

        for(var j = 0; j < receipts[i].items.length; j++)
        {
            if(receipts[i].items[j].taxed) taxed_amount += receipts[i].items[j].price;
        }

        if(taxed_amount == 0)
        {
            receipts[i].tax_rate = 0;
        }
        else
        {
            receipts[i].tax_rate = receipts[i].tax / taxed_amount;
        }
    }

    // reset all person totals
    for(var i = 0; i < people.length; i++) people[i].total = 0;

    // calculate person totals item by item
    for(var i = 0; i < receipts.length; i++)
    {
        for(var j = 0; j < receipts[i].items.length; j++)
        {
            // determine how many people are paying for it
            var num_people = 0;
            for(var k = 0; k < people.length; k++)
            {
                if(people[k].opt_outs.indexOf(receipts[i].items[j]) == -1) num_people++;
            }

            // divide the price up and add it to everyone's total
            for(var k = 0; k < people.length; k++)
            {
                if(people[k].opt_outs.indexOf(receipts[i].items[j]) == -1)
                {
                    if(receipts[i].items[j].taxed)
                    {
                        people[k].total += (receipts[i].items[j].price + receipts[i].items[j].price * receipts[i].tax_rate) / num_people;
                    }
                    else
                    {
                        people[k].total += receipts[i].items[j].price / num_people;
                    }
                }
            }
        }
    }

    // calculate receipt totals
    for(var i = 0; i < receipts.length; i++)
    {
        // reset receipt total
        receipts[i].total = 0;

        for(var j = 0; j < receipts[i].items.length; j++)
        {
            receipts[i].total += receipts[i].items[j].price;
        }

        if(receipts[i].tax_rate != 0)
        {
            receipts[i].total += receipts[i].tax;
        }
    }
}

function update_table()
{
    calc_totals();

    $('#table .person').remove();
    $('#table .person-total').remove();
    $('#table .receipt').remove();

    for(var i = 0; i < people.length; i++)
    {
        // table heading
        $('#table thead tr td:last-child').before('<th class="text-center person person-' + people[i].id + '">' + people[i].name + '&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="close float-none align-bottom person-delete">&times</button></th>');

        // totals
        $('#table tbody tr:last-child td:last-child').before('<td class="text-center font-weight-bold person-total">$' + people[i].total.toFixed(2) + '</td>');
    }

    for(var i = 0; i < receipts.length; i++)
    {
        // receipt name
        $('#table tbody tr:last-child').before('<tr class="receipt receipt-' + receipts[i].id + '"><td colspan="4" style="border-right: 2px solid #e9ecef"><i>' + receipts[i].name + '</i>&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="close float-none align-bottom receipt-delete">&times;</button></td><td colspan="' + (people.length + 1) + '"></td></tr>')

        for(var j = 0; j < receipts[i].items.length; j++)
        {
            // receipt item
            var tag = '<tr class="receipt receipt-' + receipts[i].id + ' item-' + receipts[i].items[j].id + '"><td><form class="item-name"><input type="text" placeholder="Item Name" class="form-control" value="' + receipts[i].items[j].name + '"></form></td><td><form class="item-price"><input type="text" placeholder="0.00" class="form-control" size="5" value="' + receipts[i].items[j].price.toFixed(2) + '"></form></td>';

            if(receipts[i].items[j].taxed)
            {
                tag += '<td class="text-center"><input type="checkbox" class="form-check-input item-taxed" checked="checked"></td>';
            }
            else
            {
                tag += '<td class="text-center"><input type="checkbox" class="form-check-input item-taxed"></td>';
            }

            tag += '<td class="text-center" style="border-right: 2px solid #e9ecef"><button type="button" class="close float-none align-bottom item-delete"><span>&times;</span></button></td>';

            for(var k = 0; k < people.length; k++)
            {
                if(people[k].opt_outs.indexOf(receipts[i].items[j]) == -1)
                {
                    tag += '<td class="text-center person-' + people[k].id + '"><input type="checkbox" class="form-check-input item-opt-out" checked="checked"></td>';
                }
                else
                {
                    tag += '<td class="text-center person-' + people[k].id + '"><input type="checkbox" class="form-check-input item-opt-out"></td>';
                }
            }

            tag += '<td></td></tr>';

            $('#table tbody tr:last-child').before(tag);
        }

        // receipt tax
        $('#table tbody tr:last-child').before('<tr class="receipt receipt-' + receipts[i].id + '"><td><div class="float-left"><button type="button" class="btn item-add">Add Item</button></div><div class="float-right">Tax</div></td><td><form class="receipt-tax"><input type="text" class="form-control" size="5" placeholder="0.00" value="' + receipts[i].tax.toFixed(2) + '"></form></td><td colspan="2" style="border-right: 2px solid #e9ecef"></td><td colspan="' + (people.length + 1) + '"></td></tr>');

        // receipt subtotal
        $('#table tbody tr:last-child').before('<tr class="receipt receipt-' + receipts[i].id + '"><td class="text-right">Subtotal</td><td class="font-weight-bold">$' + receipts[i].total.toFixed(2) + '</td><td colspan="2" style="border-right: 2px solid #e9ecef"></td><td colspan="' + (people.length + 1) + '"></td></tr>');
    }

    // total
    var total = 0;
    for(var i = 0; i < receipts.length; i++) total += receipts[i].total;
    $('#table #total').text('$' + total.toFixed(2));
}

function show_person_name(e)
{
    e.preventDefault();

    $('#table .person-add').hide();
    $('#table .person-add-name input').val('');
    $('#table .person-add-name').show();
    $('#table .person-add-name input').focus();
    $('#table .person-add-name input').focusout(add_person);
    $('#table .person-add-name').submit(add_person);
}

function show_receipt_name(e)
{
    e.preventDefault();

    $('#table .receipt-add').hide();
    $('#table .receipt-add-name input').val('');
    $('#table .receipt-add-name').show();
    $('#table .receipt-add-name input').focus();
    $('#table .receipt-add-name input').focusout(add_receipt);
    $('#table .receipt-add-name').submit(add_receipt);
}

$(document).ready(function()
{
    $('#table').on('click', '.person-add', show_person_name);
    $('#table').on('click', '.person-delete', delete_person);
    $('#table').on('click', '.receipt-add', show_receipt_name);
    $('#table').on('click', '.receipt-delete', delete_receipt);
    $('#table').on('focusout', '.receipt-tax input', update_receipt_tax);
    $('#table').on('submit', '.receipt-tax', update_receipt_tax);
    $('#table').on('click', '.item-add', add_item);
    $('#table').on('click', '.item-delete', delete_item);
    $('#table').on('change', '.item-taxed', toggle_item_taxed);
    $('#table').on('change', '.item-opt-out', toggle_item_opt_out);
    $('#table').on('focusout', '.item-name input', update_item_name);
    $('#table').on('submit', '.item-name', update_item_name);
    $('#table').on('focusout', '.item-price input', update_item_price);
    $('#table').on('submit', '.item-price', update_item_price);

    update_table();
});
