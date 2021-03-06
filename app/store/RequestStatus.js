Ext.define('signME.store.RequestStatus', {

	model: 'signME.model.Document',
	extend: 'Ext.data.Store',
	
	autoSync: true,
	autoLoad: true,
	pageSize: 500,

	
	proxy: {
		//the store will get the content from CouchDB			
		type: 'rest',
		appendId: true,
		noCache: false,
		idProperty: '_id',

		api: {
			create: 'http://localhost/couch/signme',
			read:	'http://localhost/couch/signme/_design/documents/_view/requestStatus_by_user',
			update:	'http://localhost/couch/signme',
			destroy:'http://localhost/couch/signme'
		},

		reader: {
			type: 'json',
			root: 'rows',
			record: 'value',
			idProperty: '_id',
			totalProperty: 'total_rows',
			successProperty: 'ok'
		},
		
		//Custom Writer
		writer: {
			allowSingle: true,
			encode: false,
			writeAllFields: true,
			root: '',
			getRecordData: function(record,operation){
				if (operation.action == 'create'){
					delete record.data._id;
					delete record.data._rev;
				}
				
				if (!record.data._attachments){
					delete record.data._attachments;
				}
				
				return record.data;
			}
		},
		
		buildUrl: function(request) {
			var me        = this,
				operation = request.operation,
				url       = me.getUrl(request);	
			
			if (request.operation.action == "read" && typeof user !== "undefined"){
				url += '?key=\"'+user.data.username+'\"'
			}
			
			return url;
		}
	
	},
		

});
