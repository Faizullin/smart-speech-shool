FROM orgoro/dlib-opencv-python

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ENV HOME=/app
RUN mkdir $HOME
WORKDIR $HOME

RUN mkdir $HOME/public
RUN mkdir $HOME/public/static
RUN mkdir $HOME/public/media
RUN mkdir $HOME/logs
RUN mkdir $HOME/logs/api
RUN mkdir $HOME/logs/celery
RUN mkdir $HOME/accounts_face_recognition
RUN mkdir $HOME/accounts_face_recognition/model_data


# install system dependencies
RUN apt-get update && \
    apt install -y gcc netcat \
                python3-pip \
                python3-opencv

RUN pip install --trusted-host pypi.python.org --upgrade pip

RUN pip3 install -U pip wheel cmake
RUN pip3 install dlib face_recognition gunicorn
COPY requirements.txt $HOME/requirements.txt
RUN pip install -r $HOME/requirements.txt

COPY ./entrypoint.sh $HOME/entrypoint.sh
RUN sed -i 's/\r$//g' $HOME/entrypoint.sh
RUN chmod +x $HOME/entrypoint.sh

COPY . .

ENTRYPOINT ["sh", "./entrypoint.sh"]
