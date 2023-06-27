module.exports = getAnswer = async (req, res) => {
    try {
        return res.status(200).send({ message: 'The API is working fine' });
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
};
