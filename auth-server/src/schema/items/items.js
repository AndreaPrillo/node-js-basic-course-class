const getItemOptions = {
    schema: {
        params: {
            id: { type: "string" }
        },

        response: {
            200: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    desc: { type: "string" }
                },
                required:["id","name","desc"]
            },
            400 :{
                type : "string"
            }
        }
    },
}

module.exports = { getItemOptions }