$(function() {
	// solving the active menu problem
	switch (menu) {

	case 'About Us':
		$('#about').addClass('active');
		break;
	case 'Contact Us':
		$('#contact').addClass('active');
		break;
	case 'All Products':
		$('#listProducts').addClass('active');
		break;
	case 'Product Management':
		$('#manageProduct').addClass('active');
		break;
	default:
		if (menu == "Home")
			break;
		$('#listProducts').addClass('active');
		$('#a_' + menu).addClass('active');
		break;
	}

	// code for jquery dataTable
	var $table = $('#productListTable');

	// execute the below code only where we have this table
	if ($table.length) {
		// console.log('Inside the table!');

		var jsonUrl = '';
		if (window.categoryId == '') {
			jsonUrl = window.contextRoot + '/json/data/all/products';
		} else {
			jsonUrl = window.contextRoot + '/json/data/category/'
					+ window.categoryId + '/products';
		}

		$table
				.DataTable({

					lengthMenu : [ [ 3, 5, 10, -1 ],
							[ '3 Records', '5 Records', '10 Records', 'ALL' ] ],
					pageLength : 5,
					ajax : {
						url : jsonUrl,
						dataSrc : ''
					},
					columns : [
							{
								data : 'code',
								bSortable : false,
								mRender : function(data, type, row) {

									return '<img src="' + window.contextRoot
											+ '/resources/images/' + data
											+ '.jpg" class="dataTableImg"/>';

								}
							},
							{
								data : 'name'
							},
							{
								data : 'brand'
							},
							{
								data : 'unitPrice',
								mRender : function(data, type, row) {
									return '&#8377; ' + data
								}
							},
							{
								data : 'quantity',
								mRender : function(data, type, row) {

									if (data < 1) {
										return '<span style="color:red">Out of Stock!</span>';
									}

									return data;

								}
							},
							{
								data : 'id',
								bSortable : false,
								mRender : function(data, type, row) {

									var str = '';
									str += '<a href="'
											+ window.contextRoot
											+ '/show/'
											+ data
											+ '/product" class="btn btn-primary"><span class="glyphicon glyphicon-eye-open"></span></a> &#160;';

									if (row.quantity < 1) {
										str += '<a href="javascript:void(0)" class="btn btn-success disabled"><span class="glyphicon glyphicon-shopping-cart"></span></a>';
									} else {

										str += '<a href="'
												+ window.contextRoot
												+ '/cart/add/'
												+ data
												+ '/product" class="btn btn-success"><span class="glyphicon glyphicon-shopping-cart"></span></a>';
									}

									return str;

								}

							} ]
				});
	}

	
	
	// list of all products for admin
	var $productsTable = $('#productsTable');
	
	
	if($productsTable.length) {
		
		var jsonUrl = window.contextRoot + '/json/data/admin/all/products';
		console.log(jsonUrl);
		
		$productsTable.DataTable({
					lengthMenu : [ [ 10, 30, 50, -1 ], [ '10 Records', '30 Records', '50 Records', 'ALL' ] ],
					pageLength : 30,
					ajax : {
						url : jsonUrl,
						dataSrc : ''
					},
					columns : [		
					           	{data: 'id'},


					           	{data: 'code',
					           	 bSortable: false,
					           		mRender: function(data,type,row) {
					           			return '<img src="' + window.contextRoot
										+ '/resources/images/' + data
										+ '.jpg" class="dataTableImg"/>';					           			
					           		}
					           	},
					           	{
									data : 'name'
								},
								{
									data : 'brand'
								},
								{
									data : 'quantity',
									mRender : function(data, type, row) {

										if (data < 1) {
											return '<span style="color:red">Out of Stock!</span>';
										}

										return data;

									}
								},
								{
									data : 'unitPrice',
									mRender : function(data, type, row) {
										return '&#8377; ' + data
									}
								},
								{
									data : 'active',
									bSortable : false,
									mRender : function(data, type, row) {
										var str = '';
										if(data) {											
											str += '<label class="switch"> <input type="checkbox" value="'+row.id+'" checked="checked">  <div class="slider round"> </div></label>';
											
										}else {
											str += '<label class="switch"> <input type="checkbox" value="'+row.id+'">  <div class="slider round"> </div></label>';
										}
										
										return str;
									}
								},
								{
									data : 'id',
									bSortable : false,
									mRender : function(data, type, row) {

										var str = '';
										str += '<a href="'
												+ window.contextRoot
												+ '/manage/'
												+ data
												+ '/product" class="btn btn-primary"><span class="glyphicon glyphicon-pencil"></span></a> &#160;';

										return str;
									}
								}					           	
					],
					
					
					initComplete: function () {
						var api = this.api();
						api.$('.switch input[type="checkbox"]').on('change' , function() {							
							var dText = (this.checked)? 'You want to activate the Product?': 'You want to de-activate the Product?';
							var checked = this.checked;
							var checkbox = $(this);
						    bootbox.confirm({
						    	size: 'medium',
						    	title: 'Product Activation/Deactivation',
						    	message: dText,
						    	callback: function (confirmed) {
							        if (confirmed) {
							            $.ajax({							            	
							            	type: 'POST',
							            	url: window.contextRoot + '/manage/product/'+checkbox.prop('value')+'/activation',
							        		timeout : 100000,
							        		success : function(data) {
							        			bootbox.alert(data);							        										        			
							        		},
							        		error : function(e) {
							        			bootbox.alert('ERROR: '+ e);
							        			//display(e);
							        		}						            	
							            });
							        }
							        else {							        	
							        	checkbox.prop('checked', !checked);
							        }
						    	}
						    });																											
						});
							
					}
				});
	}
	
	
	
	
	// jQuery Validation Code

	//methods required for validation
	
	function errorPlacement(error, element) {
		// Add the 'help-block' class to the error element
		error.addClass("help-block");
		
		// add the error label after the input element
		error.insertAfter(element);
		
		
		// add the has-feedback class to the
		// parent div.validate in order to add icons to inputs
		element.parents(".validate").addClass("has-feedback");	

	}	
	
	
	
	// validating the product form element	
	// fetch the form element
	$categoryForm = $('#categoryForm');
	
	if($categoryForm.length) {
		
		$categoryForm.validate({			
				rules: {
					name: {
						required: true,
						minlength: 3
					},
					description: {
						required: true,
						minlength: 3					
					}				
				},
				messages: {					
					name: {
						required: 'Please enter product name!',
						minlength: 'Please enter atleast five characters'
					},
					description: {
						required: 'Please enter product name!',
						minlength: 'Please enter atleast five characters'
					}					
				},
				errorElement : "em",
				errorPlacement : function(error, element) {
					errorPlacement(error, element);
				}				
			}
		
		);
		
	}
	
	
	
	$alert = $('.alert');
	if($alert.length) {
		setTimeout(function() {
	    	$alert.fadeOut('slow');
		   }, 3000
		);		
	}
		
	
	$(document).on('click', '[data-toggle="confirm"]', function (e) {
	    e.preventDefault();
	    var lHref = $(this).attr('href');
	    var lText = this.attributes.getNamedItem("data-title") ? this.attributes.getNamedItem("data-title").value : "Are you sure?"; // If data-title is not set use default text
	    bootbox.confirm({
	    	size: 'medium',
	    	title: 'Delete Product',
	    	message: lText,
	    	callback: function (confirmed) {
		        if (confirmed) {
		            window.location.replace(lHref); // similar behavior as an HTTP redirect (DOESN'T increment browser history)
		            //window.location.href = lHref; // similar behavior as clicking on a link (Increments browser history)
		        }
	    	}
	    });
	});	
	
	
	
	
	
	
});