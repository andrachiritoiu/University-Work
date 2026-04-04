FROM python:3.8-slim

WORKDIR /app

COPY . .

RUN pip install flask

EXPOSE 8001

CMD ["python3", "simple_flask.py"]